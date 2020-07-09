void rect(in vec2 uv, in vec4 rect, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_R_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(3,1,1,14),shift,phi,scale,distort,d);
rect(uv,vec4(5,2,4,2),shift,phi,scale,distort,d);
rect(uv,vec4(8,2,1,3),shift,phi,scale,distort,d);
rect(uv,vec4(2,3,8,1),shift,phi,scale,distort,d);rect(uv,vec4(3,3,2,8),shift,phi,scale,distort,d);rect(uv,vec4(8,3,2,2),shift,phi,scale,distort,d);rect(uv,vec4(9,3,1,6),shift,phi,scale,distort,d);rect(uv,vec4(8,4,3,1),shift,phi,scale,distort,d);rect(uv,vec4(9,4,2,4),shift,phi,scale,distort,d);rect(uv,vec4(8,7,1,3),shift,phi,scale,distort,d);rect(uv,vec4(7,8,2,2),shift,phi,scale,distort,d);rect(uv,vec4(3,9,4,2),shift,phi,scale,distort,d);rect(uv,vec4(5,9,2,3),shift,phi,scale,distort,d);rect(uv,vec4(6,9,1,4),shift,phi,scale,distort,d);rect(uv,vec4(2,10,1,7),shift,phi,scale,distort,d);rect(uv,vec4(6,12,2,1),shift,phi,scale,distort,d);rect(uv,vec4(7,12,1,3),shift,phi,scale,distort,d);rect(uv,vec4(1,13,2,4),shift,phi,scale,distort,d);rect(uv,vec4(7,13,2,2),shift,phi,scale,distort,d);rect(uv,vec4(8,13,1,3),shift,phi,scale,distort,d);rect(uv,vec4(7,14,3,1),shift,phi,scale,distort,d);rect(uv,vec4(8,14,2,2),shift,phi,scale,distort,d);rect(uv,vec4(9,14,1,4),shift,phi,scale,distort,d);rect(uv,vec4(8,15,3,1),shift,phi,scale,distort,d);
// rect(uv,vec4(9,15,2,2),shift,phi,scale,distort,d);
}
