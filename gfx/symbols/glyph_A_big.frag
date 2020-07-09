void rect(in vec2 uv, in vec4 rect, in vec2 shift, in float phi, in float scale, in float distort, inout float d);
void glyph_A_big(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(7,1,1,5),shift,phi,scale,distort,d);
rect(uv,vec4(6,2,1,6),shift,phi,scale,distort,d);
rect(uv,vec4(6,3,3,3),shift,phi,scale,distort,d);
rect(uv,vec4(8,3,1,15),shift,phi,scale,distort,d);
rect(uv,vec4(5,5,1,7),shift,phi,scale,distort,d);
rect(uv,vec4(8,6,2,12),shift,phi,scale,distort,d);
rect(uv,vec4(4,7,1,6),shift,phi,scale,distort,d);
rect(uv,vec4(2,9,4,1),shift,phi,scale,distort,d);
rect(uv,vec4(3,9,3,2),shift,phi,scale,distort,d);

rect(uv,vec4(3,10,7,1),shift,phi,scale,distort,d);
rect(uv,vec4(4,10,6,2),shift,phi,scale,distort,d);
rect(uv,vec4(7,10,3,3),shift,phi,scale,distort,d);

rect(uv,vec4(4,11,7,1),shift,phi,scale,distort,d);
rect(uv,vec4(7,11,4,2),shift,phi,scale,distort,d);
rect(uv,vec4(2,12,1,4),shift,phi,scale,distort,d);
rect(uv,vec4(2,12,2,2),shift,phi,scale,distort,d);
rect(uv,vec4(8,14,3,3),shift,phi,scale,distort,d);
rect(uv,vec4(1,15,1,3),shift,phi,scale,distort,d);
}
