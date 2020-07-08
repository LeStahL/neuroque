void rect(in vec2 uv, in vec4 rect, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_I_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(3,1,7,2),shift,phi,scale,distort,d);rect(uv,vec4(6,1,1,9),shift,phi,scale,distort,d);rect(uv,vec4(6,1,2,4),shift,phi,scale,distort,d);rect(uv,vec4(1,2,10,1),shift,phi,scale,distort,d);rect(uv,vec4(5,4,1,13),shift,phi,scale,distort,d);rect(uv,vec4(4,8,2,9),shift,phi,scale,distort,d);rect(uv,vec4(2,15,6,2),shift,phi,scale,distort,d);rect(uv,vec4(2,15,8,1),shift,phi,scale,distort,d);rect(uv,vec4(0,16,8,1),shift,phi,scale,distort,d);
}
