void rect(in vec2 uv, in vec4 rect, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_Z_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(4,2,1,3),shift,phi,scale,distort,d);rect(uv,vec4(10,2,1,3),shift,phi,scale,distort,d);rect(uv,vec4(3,3,2,2),shift,phi,scale,distort,d);rect(uv,vec4(3,3,8,1),shift,phi,scale,distort,d);rect(uv,vec4(9,3,1,3),shift,phi,scale,distort,d);rect(uv,vec4(2,4,1,2),shift,phi,scale,distort,d);rect(uv,vec4(1,5,2,1),shift,phi,scale,distort,d);rect(uv,vec4(7,5,2,2),shift,phi,scale,distort,d);rect(uv,vec4(6,6,1,3),shift,phi,scale,distort,d);rect(uv,vec4(4,8,1,3),shift,phi,scale,distort,d);rect(uv,vec4(4,8,3,1),shift,phi,scale,distort,d);rect(uv,vec4(3,9,1,6),shift,phi,scale,distort,d);rect(uv,vec4(9,11,3,2),shift,phi,scale,distort,d);rect(uv,vec4(11,11,1,3),shift,phi,scale,distort,d);rect(uv,vec4(2,12,1,4),shift,phi,scale,distort,d);rect(uv,vec4(6,12,2,2),shift,phi,scale,distort,d);rect(uv,vec4(6,12,6,1),shift,phi,scale,distort,d);rect(uv,vec4(2,13,3,2),shift,phi,scale,distort,d);rect(uv,vec4(2,13,6,1),shift,phi,scale,distort,d);rect(uv,vec4(1,14,2,2),shift,phi,scale,distort,d);
}