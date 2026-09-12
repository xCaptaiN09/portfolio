import { useEffect, useRef } from 'react'

const CHARSET = ['-', '<', '>', '*', '+', '^', '#', '$']

const VS = `
attribute vec4 aVertexPosition;
void main() {
  gl_Position = aVertexPosition;
}
`

const FS = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_glyphs;
const float CHARS = 8.0;
const float CELL = 16.0;

mat2 rot(float a) {
  float s = sin(a), c = cos(a);
  return mat2(c, -s, s, c);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;

  vec2 f = p;
  float t = u_time * 0.35;
  for (float i = 1.0; i < 4.0; i++) {
    f *= rot(t * 0.1);
    f.x += sin(f.y * 2.0 * i + t) * 0.5;
    f.y += cos(f.x * 1.5 * i - t * 0.8) * 0.5;
  }
  float wave = sin(f.x * 2.0 + f.y * 3.0) * 0.5 + 0.5;
  float intensity = clamp(pow(wave, 1.3) * 0.72 + uv.x * 0.48 - 0.08, 0.0, 1.0);

  vec2 cuv = fract(gl_FragCoord.xy / CELL);
  float idx = floor(intensity * (CHARS - 0.001));
  vec2 guv = vec2((idx + cuv.x) / CHARS, cuv.y);
  float mask = texture2D(u_glyphs, guv).a;

  vec3 c0 = vec3(0.14, 0.025, 0.008);
  vec3 c1 = vec3(0.52, 0.09, 0.02);
  vec3 c2 = vec3(0.93, 0.29, 0.04);
  vec3 c3 = vec3(1.0, 0.72, 0.45);
  vec3 bg = mix(c0, c1, smoothstep(0.0, 0.45, intensity));
  bg = mix(bg, c2, smoothstep(0.40, 0.75, intensity));
  bg = mix(bg, c3, smoothstep(0.75, 1.0, intensity));

  vec3 fg = mix(bg * 1.55 + 0.035, vec3(1.0, 0.88, 0.72), smoothstep(0.5, 0.9, intensity));
  fg = clamp(fg, 0.0, 1.0);

  vec3 final = mix(bg, fg, mask);
  gl_FragColor = vec4(final, 1.0);
}
`

export function AsciiFlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false })
    if (!gl) return

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)
      if (!sh) throw new Error('shader creation failed')
      gl.shaderSource(sh, src)
      gl.compileShader(sh)
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        const log = gl.getShaderInfoLog(sh)
        gl.deleteShader(sh)
        throw new Error(`shader compile failed: ${log}`)
      }
      return sh
    }

    let program: WebGLProgram | null = null
    try {
      const vs = compile(gl.VERTEX_SHADER, VS)
      const fs = compile(gl.FRAGMENT_SHADER, FS)
      program = gl.createProgram()
      if (!program) throw new Error('program creation failed')
      gl.attachShader(program, vs)
      gl.attachShader(program, fs)
      gl.linkProgram(program)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(`program link failed: ${gl.getProgramInfoLog(program)}`)
      }
    } catch (err) {
      console.error(err)
      return
    }
    gl.useProgram(program)

    const atlas = document.createElement('canvas')
    atlas.width = CHARSET.length * 20
    atlas.height = 20
    const ctx = atlas.getContext('2d')
    if (ctx) {
      ctx.clearRect(0, 0, atlas.width, atlas.height)
      ctx.font = '16px monospace'
      ctx.fillStyle = '#fff'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      CHARSET.forEach((ch, i) => ctx.fillText(ch, i * 20 + 10, 11))
    }
    const tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlas)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, 1, 1, -1, -1, 1, -1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(program, 'aVertexPosition')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const resLoc = gl.getUniformLocation(program, 'u_resolution')
    const timeLoc = gl.getUniformLocation(program, 'u_time')

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const w = Math.floor(canvas.clientWidth * dpr)
      const h = Math.floor(canvas.clientHeight * dpr)
      if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
    }

    let paused = false
    const io = new IntersectionObserver((entries) => {
      paused = !entries[0].isIntersecting
    })
    io.observe(canvas)

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const start = Date.now()
    let raf = 0

    const render = () => {
      resize()
      if (!paused) {
        gl.uniform2f(resLoc, canvas.width, canvas.height)
        gl.uniform1f(timeLoc, reduce ? 4.2 : (Date.now() - start) / 1000)
        gl.disable(gl.BLEND)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      }
      if (!reduce) raf = requestAnimationFrame(render)
    }
    render()
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      io.disconnect()
      gl.deleteTexture(tex)
      gl.deleteBuffer(buf)
      if (program) gl.deleteProgram(program)
    }
  }, [])

  return (
    <div className="ascii-flow" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}
