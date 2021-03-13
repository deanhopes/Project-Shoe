precision mediump float;

uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vRandom;

void main()
{
  gl_FragColor = vec4(1.0, 1.0, 1.0, 0.1);
}