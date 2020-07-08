void rect(in vec2 uv, in vec4 rect, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_L_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(5,2,1,5),shift,phi,scale,distort,d);rect(uv,vec4(5,2,2,1),shift,phi,scale,distort,d);rect(uv,vec4(4,3,1,7),shift,phi,scale,distort,d);rect(uv,vec4(3,6,1,11),shift,phi,scale,distort,d);rect(uv,vec4(2,8,2,9),shift,phi,scale,distort,d);rect(uv,vec4(7,13,2,3),shift,phi,scale,distort,d);rect(uv,vec4(7,13,3,2),shift,phi,scale,distort,d);rect(uv,vec4(2,14,3,3),shift,phi,scale,distort,d);rect(uv,vec4(2,14,7,2),shift,phi,scale,distort,d);rect(uv,vec4(2,14,9,1),shift,phi,scale,distort,d);rect(uv,vec4(1,15,8,1),shift,phi,scale,distort,d);
}
