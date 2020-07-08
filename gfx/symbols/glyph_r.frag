void rect(in vec2 uv, in vec4 rect, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_r(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(5,6,1,2),shift,phi,scale,distort,d);rect(uv,vec4(1,7,1,6),shift,phi,scale,distort,d);rect(uv,vec4(4,7,1,2),shift,phi,scale,distort,d);rect(uv,vec4(4,7,3,1),shift,phi,scale,distort,d);rect(uv,vec4(1,8,2,5),shift,phi,scale,distort,d);rect(uv,vec4(1,8,3,2),shift,phi,scale,distort,d);rect(uv,vec4(2,8,1,7),shift,phi,scale,distort,d);
}
