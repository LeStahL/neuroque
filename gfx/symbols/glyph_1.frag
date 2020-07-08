void rect(in vec2 uv, in vec4 rect, in vec2 shift, in float phi, in float scale, in float distort, inout float d);

void glyph_1(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(8,1,1,3),shift,phi,scale,distort,d);rect(uv,vec4(7,2,1,16),shift,phi,scale,distort,d);rect(uv,vec4(5,3,1,3),shift,phi,scale,distort,d);rect(uv,vec4(5,3,3,2),shift,phi,scale,distort,d);rect(uv,vec4(4,4,1,3),shift,phi,scale,distort,d);rect(uv,vec4(3,5,1,3),shift,phi,scale,distort,d);rect(uv,vec4(7,6,2,3),shift,phi,scale,distort,d);rect(uv,vec4(2,7,1,2),shift,phi,scale,distort,d);rect(uv,vec4(6,7,2,9),shift,phi,scale,distort,d);rect(uv,vec4(7,16,2,2),shift,phi,scale,distort,d);
}