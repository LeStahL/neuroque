void rect(in vec2 uv, in vec4 rect, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_colon(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(5,5,2,4),shift,phi,scale,distort,d);rect(uv,vec4(5,6,3,2),shift,phi,scale,distort,d);rect(uv,vec4(4,7,3,2),shift,phi,scale,distort,d);rect(uv,vec4(6,12,2,3),shift,phi,scale,distort,d);rect(uv,vec4(6,12,3,2),shift,phi,scale,distort,d);rect(uv,vec4(5,13,4,1),shift,phi,scale,distort,d);
}
