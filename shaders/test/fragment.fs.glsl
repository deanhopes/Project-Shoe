precision mediump float;

varying vec3 vNormal;
varying vec3 vViewPosition;

void main()
{
  gl_FragColor = vec4(vViewPosition, 0.5);
}