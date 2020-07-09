#version 130
void rect(in vec2 uv, in vec4 rect, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_slushy(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(5,1,1,4),shift,phi,scale,distort,d);rect(uv,vec4(4,3,1,6),shift,phi,scale,distort,d);rect(uv,vec4(3,6,1,7),shift,phi,scale,distort,d);rect(uv,vec4(2,9,1,7),shift,phi,scale,distort,d);rect(uv,vec4(1,14,1,3),shift,phi,scale,distort,d);
}