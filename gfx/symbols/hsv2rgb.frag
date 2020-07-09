#version 130
void hsv2rgb(in vec3 c, out vec3 o)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    o = c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
