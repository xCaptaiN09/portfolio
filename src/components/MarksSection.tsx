import { useEffect, useRef } from 'react'

const VS = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`

const FS = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i), b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0)), d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 5; i++) { v += a * vnoise(p); p = r * p * 2.03; a *= 0.5; }
  return v;
}
float sdSeg(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}
float mark(vec2 p) {
  float d = 1e9;
  for (int i = 0; i < 12; i++) {
    float fi = float(i);
    float a = fi * 0.5235988 + 0.26;
    vec2 dir = vec2(cos(a), sin(a));
    float r1 = 0.14 + 0.055 * mod(fi, 3.0) / 2.0;
    d = min(d, sdSeg(p, dir * 0.036, dir * r1) - 0.019);
  }
  return d;
}
vec3 fireRamp(float x) {
  x = clamp(x, 0.0, 1.0);
  vec3 c = mix(vec3(0.0), vec3(0.45, 0.06, 0.02), smoothstep(0.02, 0.30, x));
  c = mix(c, vec3(0.95, 0.34, 0.08), smoothstep(0.28, 0.55, x));
  c = mix(c, vec3(1.0, 0.68, 0.22), smoothstep(0.52, 0.78, x));
  c = mix(c, vec3(1.0, 0.97, 0.88), smoothstep(0.78, 0.97, x));
  return c;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p = (uv - 0.5) * vec2(u_res.x / u_res.y, 1.0) * 1.4;
  float t = u_time;

  float d0 = mark(p);
  float e = 0.012;
  vec2 g = vec2(
    mark(p + vec2(e, 0.0)) - mark(p - vec2(e, 0.0)),
    mark(p + vec2(0.0, e)) - mark(p - vec2(0.0, e))
  );
  float upw = smoothstep(-0.2, 0.9, normalize(g + 1e-5).y);

  float n1 = fbm(vec2(p.x * 12.0, p.y * 3.0 - t * 2.1));
  float n2 = fbm(vec2(p.x * 6.0 + 41.3, p.y * 1.7 - t * 1.25));
  float d0f = d0 + (hash21(uv * 771.0 + t * 1.3) - 0.5) * 0.004;
  float rise = max(0.0, n1 * 1.15 + n2 * 0.65 - 0.5) * 1.3;
  float adv = smoothstep(-0.02, 0.12, d0f);
  vec2 offs = vec2((n2 - 0.5) * 0.05, -rise * 0.30 * adv);
  float df = mark(p + offs) + (hash21(uv * 997.0 + t) - 0.5) * 0.004;

  float heat = clamp(1.0 - df / 0.04, 0.0, 1.0);
  heat *= mix(0.1, 1.0, upw);
  heat *= 1.0 - 0.45 * smoothstep(0.05, 0.16, d0f);
  float tongue = smoothstep(0.25, 0.70, heat);
  float body = pow(heat, 2.2) * 0.45;
  float f = max(tongue, body);

  vec3 col = vec3(0.0);
  col += fireRamp(f * (1.05 - 0.4 * smoothstep(0.01, 0.14, d0)));
  float inside = smoothstep(0.004, -0.004, d0);
  float core = smoothstep(0.0, -0.02, d0);
  vec3 markCol = mix(vec3(1.0, 0.92, 0.78), vec3(1.0, 1.0, 0.98), core);
  col = mix(col, markCol, inside);
  col += exp(-max(d0, 0.0) / 0.02) * vec3(1.0, 0.55, 0.22) * 0.35 * (1.0 - inside * 0.9);
  col += exp(-max(d0, 0.0) / 0.07) * vec3(0.55, 0.14, 0.03) * 0.35 * (0.6 + 0.4 * n2);
  col = col / (1.0 + col * 0.12);

  float alpha = clamp(max(f, inside) * 1.4 + exp(-max(d0, 0.0) / 0.07) * 0.5, 0.0, 1.0);
  gl_FragColor = vec4(col, alpha);
}
`

export function MarksSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', { alpha: true, antialias: false })
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

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, 1, 1, -1, -1, 1, -1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(program, 'aPos')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const resLoc = gl.getUniformLocation(program, 'u_res')
    const timeLoc = gl.getUniformLocation(program, 'u_time')

    const coarse = window.matchMedia('(pointer: coarse)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1 : 1.5)
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

    const start = Date.now()
    let raf = 0

    const draw = (t: number) => {
      gl.uniform2f(resLoc, canvas.width, canvas.height)
      gl.uniform1f(timeLoc, t)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    const render = () => {
      resize()
      if (!paused) draw(reduce || coarse ? 2.2 : (Date.now() - start) / 1000)
      if (!reduce && !coarse) raf = requestAnimationFrame(render)
    }
    render()
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      io.disconnect()
      gl.deleteBuffer(buf)
      if (program) gl.deleteProgram(program)
    }
  }, [])

  return (
    <section className="marks">
      <canvas ref={canvasRef} className="marks__canvas" aria-hidden="true" />
      <p className="marks__statement">
        Kernels that boot, themes that breathe, tools that stay out of the way —
        low-level work held to a high standard of craft.
      </p>
      <span className="marks__scroll">Scroll</span>
      <span className="marks__year">/2026/</span>
      <div className="marks__word">xCaptaiN09</div>
    </section>
  )
}
