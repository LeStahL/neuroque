/* Hardcyber - PC-64k-Intro by Team210 at Deadline 2k19
 * Copyright (C) 2019  Alexander Kraus <nr4@z10.info>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
 
#version 130

uniform float iTime;
uniform vec2 iResolution;
uniform sampler2D iChannel0;
uniform float iScale;
uniform float iNBeats;

    
    
        
    const vec3 c = vec3(1.,0.,-1.);
    

     // nr4 advice: hardcode replace these
    #define PIXEL .005
    #define CONTOUR .01
    #define DARKBORDER 0.1
    #define DARKENING col*col*col

    float smstep(float a, float b, float x) {return smoothstep(a, b, clamp(x, a, b));}
    void rand(in vec2 x, out float n)
    {
        x += 400.;
        n = fract(sin(dot(sign(x)*abs(x) ,vec2(12.9898,78.233)))*43758.5453);
    }
    void lpnoise(in float t, in float fq, out float n)
    {
        t *= fq;
        float tt = fract(t);
        float tn = t - tt;
        float r1, r2;
        rand(vec2(floor(tn) / fq), r1);
        rand(vec2(floor(tn + 1.0) / fq), r2);
        n = mix(r1, r2, smstep(0.0, 1.0, tt));
    }
    void lp2dnoise(in float t, out vec2 n)
    {
        float r1, r2;
        lpnoise(t, 1.0, r1);
        lpnoise(t, 1.1, r2);
        n = vec2(r1, r2);
    }
    void dboxcombo(in vec2 x, in vec2 b, in float distort, inout float d)
    {
        vec2 da = abs(x*distort)-b;
        d = min(d, length(max(da,c.yy)) + min(max(da.x,da.y),0.0));
    }
    void rot(in float phi, out mat2 m)
    {
        vec2 cs = vec2(cos(phi), sin(phi));
        m = mat2(cs.x, -cs.y, cs.y, cs.x);
    }
    float sm(in float d, in float blur)
    {
        return smoothstep(.2/iResolution.y, -.2/iResolution.y, blur*d);
    }
    void rect(in vec2 uv, in vec4 rect, in vec2 shift, in float phi, in float scale, in float distort, inout float d)
    {
        mat2 R;
        rot(phi, R);
        R /= max(1.e-3, scale);
        dboxcombo(R*uv + PIXEL*(vec2(-rect.z,rect.w) + vec2(-2.*shift.x,2.*shift.y) + vec2(-2.*rect.x, 2.*rect.y)), vec2(rect.z,rect.w)*PIXEL, distort, d);
    }
    
void glyph_undefined(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d)
    {rect(uv,vec4(0,0,9,16),shift,phi,scale,distort,d);}
        void glyph_0(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(7,2,2,2),shift,phi,scale,distort,d);rect(uv,vec4(6,3,1,2),shift,phi,scale,distort,d);rect(uv,vec4(6,3,5,1),shift,phi,scale,distort,d);rect(uv,vec4(10,3,1,2),shift,phi,scale,distort,d);rect(uv,vec4(4,4,1,2),shift,phi,scale,distort,d);rect(uv,vec4(4,4,3,1),shift,phi,scale,distort,d);rect(uv,vec4(3,5,1,2),shift,phi,scale,distort,d);rect(uv,vec4(11,5,1,7),shift,phi,scale,distort,d);rect(uv,vec4(2,6,1,10),shift,phi,scale,distort,d);rect(uv,vec4(10,6,1,9),shift,phi,scale,distort,d);rect(uv,vec4(8,7,1,2),shift,phi,scale,distort,d);rect(uv,vec4(1,8,2,6),shift,phi,scale,distort,d);rect(uv,vec4(7,8,1,2),shift,phi,scale,distort,d);rect(uv,vec4(6,9,1,2),shift,phi,scale,distort,d);rect(uv,vec4(5,11,1,2),shift,phi,scale,distort,d);rect(uv,vec4(4,12,1,2),shift,phi,scale,distort,d);rect(uv,vec4(2,14,2,2),shift,phi,scale,distort,d);rect(uv,vec4(9,14,1,2),shift,phi,scale,distort,d);rect(uv,vec4(2,15,3,1),shift,phi,scale,distort,d);rect(uv,vec4(4,15,1,2),shift,phi,scale,distort,d);rect(uv,vec4(8,15,1,2),shift,phi,scale,distort,d);rect(uv,vec4(4,16,5,1),shift,phi,scale,distort,d);
}
void glyph_1(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(8,1,1,3),shift,phi,scale,distort,d);rect(uv,vec4(7,2,1,16),shift,phi,scale,distort,d);rect(uv,vec4(5,3,1,3),shift,phi,scale,distort,d);rect(uv,vec4(5,3,3,2),shift,phi,scale,distort,d);rect(uv,vec4(4,4,1,3),shift,phi,scale,distort,d);rect(uv,vec4(3,5,1,3),shift,phi,scale,distort,d);rect(uv,vec4(7,6,2,3),shift,phi,scale,distort,d);rect(uv,vec4(2,7,1,2),shift,phi,scale,distort,d);rect(uv,vec4(6,7,2,9),shift,phi,scale,distort,d);rect(uv,vec4(7,16,2,2),shift,phi,scale,distort,d);
}
void glyph_2(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(4,1,3,2),shift,phi,scale,distort,d);rect(uv,vec4(3,2,1,2),shift,phi,scale,distort,d);rect(uv,vec4(3,2,5,1),shift,phi,scale,distort,d);rect(uv,vec4(7,2,1,2),shift,phi,scale,distort,d);rect(uv,vec4(2,3,1,2),shift,phi,scale,distort,d);rect(uv,vec4(7,3,2,1),shift,phi,scale,distort,d);rect(uv,vec4(8,3,1,9),shift,phi,scale,distort,d);rect(uv,vec4(1,4,1,4),shift,phi,scale,distort,d);rect(uv,vec4(8,4,2,6),shift,phi,scale,distort,d);rect(uv,vec4(7,9,1,4),shift,phi,scale,distort,d);rect(uv,vec4(6,11,1,5),shift,phi,scale,distort,d);rect(uv,vec4(4,13,3,3),shift,phi,scale,distort,d);rect(uv,vec4(10,13,1,4),shift,phi,scale,distort,d);rect(uv,vec4(2,14,2,3),shift,phi,scale,distort,d);rect(uv,vec4(2,14,10,2),shift,phi,scale,distort,d);rect(uv,vec4(9,14,2,3),shift,phi,scale,distort,d);rect(uv,vec4(0,15,12,1),shift,phi,scale,distort,d);rect(uv,vec4(1,15,3,2),shift,phi,scale,distort,d);
}
void glyph_3(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(5,0,3,2),shift,phi,scale,distort,d);rect(uv,vec4(7,0,1,3),shift,phi,scale,distort,d);rect(uv,vec4(3,1,1,2),shift,phi,scale,distort,d);rect(uv,vec4(3,1,6,1),shift,phi,scale,distort,d);rect(uv,vec4(7,1,2,2),shift,phi,scale,distort,d);rect(uv,vec4(8,1,1,3),shift,phi,scale,distort,d);rect(uv,vec4(2,2,1,2),shift,phi,scale,distort,d);rect(uv,vec4(7,2,3,1),shift,phi,scale,distort,d);rect(uv,vec4(8,2,2,2),shift,phi,scale,distort,d);rect(uv,vec4(9,2,1,4),shift,phi,scale,distort,d);rect(uv,vec4(1,3,1,2),shift,phi,scale,distort,d);rect(uv,vec4(9,4,2,2),shift,phi,scale,distort,d);rect(uv,vec4(10,4,1,5),shift,phi,scale,distort,d);rect(uv,vec4(9,7,1,5),shift,phi,scale,distort,d);rect(uv,vec4(8,8,2,3),shift,phi,scale,distort,d);rect(uv,vec4(3,9,1,3),shift,phi,scale,distort,d);rect(uv,vec4(3,9,4,2),shift,phi,scale,distort,d);rect(uv,vec4(3,9,7,1),shift,phi,scale,distort,d);rect(uv,vec4(2,10,5,1),shift,phi,scale,distort,d);rect(uv,vec4(9,11,2,1),shift,phi,scale,distort,d);rect(uv,vec4(10,11,1,6),shift,phi,scale,distort,d);rect(uv,vec4(10,12,2,3),shift,phi,scale,distort,d);rect(uv,vec4(0,14,1,2),shift,phi,scale,distort,d);rect(uv,vec4(0,15,3,1),shift,phi,scale,distort,d);rect(uv,vec4(1,15,2,2),shift,phi,scale,distort,d);rect(uv,vec4(9,15,2,2),shift,phi,scale,distort,d);rect(uv,vec4(1,16,4,1),shift,phi,scale,distort,d);rect(uv,vec4(3,16,2,2),shift,phi,scale,distort,d);rect(uv,vec4(7,16,2,2),shift,phi,scale,distort,d);rect(uv,vec4(3,17,6,1),shift,phi,scale,distort,d);
}
void glyph_4(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(8,1,1,14),shift,phi,scale,distort,d);rect(uv,vec4(6,2,1,3),shift,phi,scale,distort,d);rect(uv,vec4(6,2,3,1),shift,phi,scale,distort,d);rect(uv,vec4(5,3,1,3),shift,phi,scale,distort,d);rect(uv,vec4(4,4,1,4),shift,phi,scale,distort,d);rect(uv,vec4(8,4,2,2),shift,phi,scale,distort,d);rect(uv,vec4(3,6,1,7),shift,phi,scale,distort,d);rect(uv,vec4(7,7,1,11),shift,phi,scale,distort,d);rect(uv,vec4(2,9,1,5),shift,phi,scale,distort,d);rect(uv,vec4(10,10,2,2),shift,phi,scale,distort,d);rect(uv,vec4(1,11,2,3),shift,phi,scale,distort,d);rect(uv,vec4(5,11,5,2),shift,phi,scale,distort,d);rect(uv,vec4(1,12,9,1),shift,phi,scale,distort,d);rect(uv,vec4(6,14,2,3),shift,phi,scale,distort,d);
}
void glyph_5(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(8,1,2,2),shift,phi,scale,distort,d);rect(uv,vec4(8,1,3,1),shift,phi,scale,distort,d);rect(uv,vec4(1,2,9,1),shift,phi,scale,distort,d);rect(uv,vec4(2,2,1,10),shift,phi,scale,distort,d);rect(uv,vec4(2,2,2,9),shift,phi,scale,distort,d);rect(uv,vec4(2,2,6,2),shift,phi,scale,distort,d);rect(uv,vec4(2,8,6,2),shift,phi,scale,distort,d);rect(uv,vec4(7,8,1,3),shift,phi,scale,distort,d);rect(uv,vec4(1,9,3,2),shift,phi,scale,distort,d);rect(uv,vec4(1,9,9,1),shift,phi,scale,distort,d);rect(uv,vec4(7,9,3,2),shift,phi,scale,distort,d);rect(uv,vec4(9,9,1,8),shift,phi,scale,distort,d);rect(uv,vec4(7,10,4,1),shift,phi,scale,distort,d);rect(uv,vec4(9,10,2,5),shift,phi,scale,distort,d);rect(uv,vec4(8,14,1,4),shift,phi,scale,distort,d);rect(uv,vec4(1,15,3,1),shift,phi,scale,distort,d);rect(uv,vec4(2,15,2,2),shift,phi,scale,distort,d);rect(uv,vec4(7,15,2,3),shift,phi,scale,distort,d);rect(uv,vec4(2,16,8,1),shift,phi,scale,distort,d);rect(uv,vec4(4,16,5,2),shift,phi,scale,distort,d);
}
void glyph_6(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(6,2,1,2),shift,phi,scale,distort,d);rect(uv,vec4(6,2,4,1),shift,phi,scale,distort,d);rect(uv,vec4(9,2,1,2),shift,phi,scale,distort,d);rect(uv,vec4(4,3,1,7),shift,phi,scale,distort,d);rect(uv,vec4(4,3,2,2),shift,phi,scale,distort,d);rect(uv,vec4(3,4,1,13),shift,phi,scale,distort,d);rect(uv,vec4(3,7,4,2),shift,phi,scale,distort,d);rect(uv,vec4(6,7,1,3),shift,phi,scale,distort,d);rect(uv,vec4(3,8,6,1),shift,phi,scale,distort,d);rect(uv,vec4(6,8,3,2),shift,phi,scale,distort,d);rect(uv,vec4(6,9,4,1),shift,phi,scale,distort,d);rect(uv,vec4(9,9,1,4),shift,phi,scale,distort,d);rect(uv,vec4(2,10,2,6),shift,phi,scale,distort,d);rect(uv,vec4(9,10,2,3),shift,phi,scale,distort,d);rect(uv,vec4(10,10,1,6),shift,phi,scale,distort,d);rect(uv,vec4(2,14,3,2),shift,phi,scale,distort,d);rect(uv,vec4(3,14,2,3),shift,phi,scale,distort,d);rect(uv,vec4(9,15,1,2),shift,phi,scale,distort,d);rect(uv,vec4(3,16,7,1),shift,phi,scale,distort,d);rect(uv,vec4(6,16,2,2),shift,phi,scale,distort,d);
}
void glyph_7(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(6,2,1,3),shift,phi,scale,distort,d);rect(uv,vec4(6,2,5,2),shift,phi,scale,distort,d);rect(uv,vec4(9,2,1,5),shift,phi,scale,distort,d);rect(uv,vec4(9,2,2,3),shift,phi,scale,distort,d);rect(uv,vec4(2,3,5,2),shift,phi,scale,distort,d);rect(uv,vec4(8,5,1,7),shift,phi,scale,distort,d);rect(uv,vec4(7,7,1,6),shift,phi,scale,distort,d);rect(uv,vec4(3,8,6,2),shift,phi,scale,distort,d);rect(uv,vec4(2,9,9,1),shift,phi,scale,distort,d);rect(uv,vec4(7,9,4,2),shift,phi,scale,distort,d);rect(uv,vec4(7,10,5,1),shift,phi,scale,distort,d);rect(uv,vec4(6,11,1,6),shift,phi,scale,distort,d);rect(uv,vec4(5,12,1,6),shift,phi,scale,distort,d);rect(uv,vec4(4,14,3,3),shift,phi,scale,distort,d);rect(uv,vec4(3,16,1,2),shift,phi,scale,distort,d);
}
void glyph_8(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(5,1,2,2),shift,phi,scale,distort,d);rect(uv,vec4(4,2,1,3),shift,phi,scale,distort,d);rect(uv,vec4(4,2,6,1),shift,phi,scale,distort,d);rect(uv,vec4(9,2,1,2),shift,phi,scale,distort,d);rect(uv,vec4(3,3,1,6),shift,phi,scale,distort,d);rect(uv,vec4(9,3,2,1),shift,phi,scale,distort,d);rect(uv,vec4(10,3,1,2),shift,phi,scale,distort,d);rect(uv,vec4(10,4,2,1),shift,phi,scale,distort,d);rect(uv,vec4(11,4,1,3),shift,phi,scale,distort,d);rect(uv,vec4(2,5,2,3),shift,phi,scale,distort,d);rect(uv,vec4(2,7,3,1),shift,phi,scale,distort,d);rect(uv,vec4(3,7,2,2),shift,phi,scale,distort,d);rect(uv,vec4(4,7,1,4),shift,phi,scale,distort,d);rect(uv,vec4(10,7,1,2),shift,phi,scale,distort,d);rect(uv,vec4(3,8,3,1),shift,phi,scale,distort,d);rect(uv,vec4(4,8,2,3),shift,phi,scale,distort,d);rect(uv,vec4(9,8,1,5),shift,phi,scale,distort,d);rect(uv,vec4(4,9,6,2),shift,phi,scale,distort,d);rect(uv,vec4(7,9,3,3),shift,phi,scale,distort,d);rect(uv,vec4(2,10,2,5),shift,phi,scale,distort,d);rect(uv,vec4(2,10,9,1),shift,phi,scale,distort,d);rect(uv,vec4(3,10,1,6),shift,phi,scale,distort,d);rect(uv,vec4(7,10,4,2),shift,phi,scale,distort,d);rect(uv,vec4(9,10,2,3),shift,phi,scale,distort,d);rect(uv,vec4(10,10,1,4),shift,phi,scale,distort,d);rect(uv,vec4(7,11,5,1),shift,phi,scale,distort,d);rect(uv,vec4(9,11,3,2),shift,phi,scale,distort,d);rect(uv,vec4(10,11,2,3),shift,phi,scale,distort,d);rect(uv,vec4(11,11,1,6),shift,phi,scale,distort,d);rect(uv,vec4(2,13,3,2),shift,phi,scale,distort,d);rect(uv,vec4(3,13,2,3),shift,phi,scale,distort,d);rect(uv,vec4(2,14,4,1),shift,phi,scale,distort,d);rect(uv,vec4(3,14,3,2),shift,phi,scale,distort,d);rect(uv,vec4(5,14,1,3),shift,phi,scale,distort,d);rect(uv,vec4(3,15,9,1),shift,phi,scale,distort,d);rect(uv,vec4(5,15,7,2),shift,phi,scale,distort,d);
}
void glyph_9(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(5,1,2,2),shift,phi,scale,distort,d);rect(uv,vec4(3,2,1,3),shift,phi,scale,distort,d);rect(uv,vec4(3,2,2,2),shift,phi,scale,distort,d);rect(uv,vec4(3,2,5,1),shift,phi,scale,distort,d);rect(uv,vec4(7,2,1,2),shift,phi,scale,distort,d);rect(uv,vec4(2,3,1,8),shift,phi,scale,distort,d);rect(uv,vec4(7,3,2,1),shift,phi,scale,distort,d);rect(uv,vec4(1,4,2,5),shift,phi,scale,distort,d);rect(uv,vec4(9,4,1,11),shift,phi,scale,distort,d);rect(uv,vec4(9,5,2,9),shift,phi,scale,distort,d);rect(uv,vec4(1,8,3,1),shift,phi,scale,distort,d);rect(uv,vec4(2,8,2,3),shift,phi,scale,distort,d);rect(uv,vec4(2,9,3,2),shift,phi,scale,distort,d);rect(uv,vec4(2,10,9,1),shift,phi,scale,distort,d);rect(uv,vec4(7,10,4,2),shift,phi,scale,distort,d);rect(uv,vec4(1,13,2,2),shift,phi,scale,distort,d);rect(uv,vec4(2,13,1,3),shift,phi,scale,distort,d);rect(uv,vec4(8,14,1,3),shift,phi,scale,distort,d);rect(uv,vec4(2,15,2,1),shift,phi,scale,distort,d);rect(uv,vec4(3,15,1,2),shift,phi,scale,distort,d);rect(uv,vec4(7,15,2,2),shift,phi,scale,distort,d);rect(uv,vec4(3,16,6,1),shift,phi,scale,distort,d);
}
void glyph_dot(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(2,13,2,3),shift,phi,scale,distort,d);rect(uv,vec4(1,14,3,2),shift,phi,scale,distort,d);rect(uv,vec4(1,14,4,1),shift,phi,scale,distort,d);
}
void glyph_lelzeichen(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){

}
void glyph_n(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(2,6,1,7),shift,phi,scale,distort,d);rect(uv,vec4(5,6,3,2),shift,phi,scale,distort,d);rect(uv,vec4(1,7,1,8),shift,phi,scale,distort,d);rect(uv,vec4(4,7,1,2),shift,phi,scale,distort,d);rect(uv,vec4(4,7,6,1),shift,phi,scale,distort,d);rect(uv,vec4(8,7,2,3),shift,phi,scale,distort,d);rect(uv,vec4(9,7,1,7),shift,phi,scale,distort,d);rect(uv,vec4(1,8,4,1),shift,phi,scale,distort,d);rect(uv,vec4(8,9,3,1),shift,phi,scale,distort,d);rect(uv,vec4(9,9,2,3),shift,phi,scale,distort,d);rect(uv,vec4(8,11,1,5),shift,phi,scale,distort,d);rect(uv,vec4(0,12,1,4),shift,phi,scale,distort,d);
}
void glyph_o(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(3,5,1,4),shift,phi,scale,distort,d);rect(uv,vec4(3,5,2,3),shift,phi,scale,distort,d);rect(uv,vec4(3,5,6,2),shift,phi,scale,distort,d);rect(uv,vec4(2,6,1,4),shift,phi,scale,distort,d);rect(uv,vec4(2,6,8,1),shift,phi,scale,distort,d);rect(uv,vec4(9,6,1,7),shift,phi,scale,distort,d);rect(uv,vec4(1,7,1,6),shift,phi,scale,distort,d);rect(uv,vec4(0,8,2,4),shift,phi,scale,distort,d);rect(uv,vec4(9,8,2,4),shift,phi,scale,distort,d);rect(uv,vec4(8,10,2,3),shift,phi,scale,distort,d);rect(uv,vec4(0,11,3,1),shift,phi,scale,distort,d);rect(uv,vec4(1,11,2,2),shift,phi,scale,distort,d);rect(uv,vec4(2,11,1,3),shift,phi,scale,distort,d);rect(uv,vec4(7,11,1,3),shift,phi,scale,distort,d);rect(uv,vec4(5,12,3,2),shift,phi,scale,distort,d);rect(uv,vec4(2,13,6,1),shift,phi,scale,distort,d);
}
void glyph_e(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(5,5,1,2),shift,phi,scale,distort,d);rect(uv,vec4(5,5,3,1),shift,phi,scale,distort,d);rect(uv,vec4(7,5,1,4),shift,phi,scale,distort,d);rect(uv,vec4(3,6,1,5),shift,phi,scale,distort,d);rect(uv,vec4(3,6,3,1),shift,phi,scale,distort,d);rect(uv,vec4(7,6,2,3),shift,phi,scale,distort,d);rect(uv,vec4(2,8,1,6),shift,phi,scale,distort,d);rect(uv,vec4(5,8,2,2),shift,phi,scale,distort,d);rect(uv,vec4(2,9,3,2),shift,phi,scale,distort,d);rect(uv,vec4(1,10,2,3),shift,phi,scale,distort,d);rect(uv,vec4(9,11,1,2),shift,phi,scale,distort,d);rect(uv,vec4(7,12,1,3),shift,phi,scale,distort,d);rect(uv,vec4(7,12,2,2),shift,phi,scale,distort,d);rect(uv,vec4(2,13,2,1),shift,phi,scale,distort,d);rect(uv,vec4(3,13,1,2),shift,phi,scale,distort,d);rect(uv,vec4(5,13,3,2),shift,phi,scale,distort,d);rect(uv,vec4(3,14,5,1),shift,phi,scale,distort,d);
}
void glyph_v(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(10,5,1,3),shift,phi,scale,distort,d);rect(uv,vec4(9,6,1,4),shift,phi,scale,distort,d);rect(uv,vec4(1,7,2,2),shift,phi,scale,distort,d);rect(uv,vec4(2,7,1,3),shift,phi,scale,distort,d);rect(uv,vec4(1,8,3,1),shift,phi,scale,distort,d);rect(uv,vec4(2,8,2,2),shift,phi,scale,distort,d);rect(uv,vec4(3,8,1,4),shift,phi,scale,distort,d);rect(uv,vec4(8,8,1,4),shift,phi,scale,distort,d);rect(uv,vec4(3,10,2,2),shift,phi,scale,distort,d);rect(uv,vec4(4,10,1,4),shift,phi,scale,distort,d);rect(uv,vec4(7,10,1,4),shift,phi,scale,distort,d);rect(uv,vec4(6,11,1,5),shift,phi,scale,distort,d);rect(uv,vec4(4,12,4,2),shift,phi,scale,distort,d);rect(uv,vec4(5,12,1,5),shift,phi,scale,distort,d);
}
void glyph_k(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(4,1,1,7),shift,phi,scale,distort,d);rect(uv,vec4(3,2,1,15),shift,phi,scale,distort,d);rect(uv,vec4(2,6,1,12),shift,phi,scale,distort,d);rect(uv,vec4(8,6,1,2),shift,phi,scale,distort,d);rect(uv,vec4(8,6,2,1),shift,phi,scale,distort,d);rect(uv,vec4(7,7,1,2),shift,phi,scale,distort,d);rect(uv,vec4(6,8,1,3),shift,phi,scale,distort,d);rect(uv,vec4(5,9,1,5),shift,phi,scale,distort,d);rect(uv,vec4(2,11,4,2),shift,phi,scale,distort,d);rect(uv,vec4(2,12,6,1),shift,phi,scale,distort,d);rect(uv,vec4(5,12,3,2),shift,phi,scale,distort,d);rect(uv,vec4(7,12,1,3),shift,phi,scale,distort,d);rect(uv,vec4(7,14,3,1),shift,phi,scale,distort,d);rect(uv,vec4(8,14,2,2),shift,phi,scale,distort,d);rect(uv,vec4(9,14,1,3),shift,phi,scale,distort,d);rect(uv,vec4(9,16,2,1),shift,phi,scale,distort,d);rect(uv,vec4(1,17,2,1),shift,phi,scale,distort,d);
}
void glyph_N(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(4,1,1,5),shift,phi,scale,distort,d);rect(uv,vec4(11,1,1,5),shift,phi,scale,distort,d);rect(uv,vec4(3,2,1,10),shift,phi,scale,distort,d);rect(uv,vec4(3,3,3,3),shift,phi,scale,distort,d);rect(uv,vec4(5,3,1,6),shift,phi,scale,distort,d);rect(uv,vec4(10,3,1,6),shift,phi,scale,distort,d);rect(uv,vec4(2,5,1,9),shift,phi,scale,distort,d);rect(uv,vec4(9,5,1,7),shift,phi,scale,distort,d);rect(uv,vec4(5,6,2,3),shift,phi,scale,distort,d);rect(uv,vec4(6,6,1,7),shift,phi,scale,distort,d);rect(uv,vec4(5,8,3,1),shift,phi,scale,distort,d);rect(uv,vec4(6,8,2,5),shift,phi,scale,distort,d);rect(uv,vec4(7,8,1,7),shift,phi,scale,distort,d);rect(uv,vec4(1,10,1,8),shift,phi,scale,distort,d);rect(uv,vec4(6,10,3,3),shift,phi,scale,distort,d);rect(uv,vec4(7,10,2,5),shift,phi,scale,distort,d);rect(uv,vec4(8,10,1,7),shift,phi,scale,distort,d);rect(uv,vec4(0,13,2,5),shift,phi,scale,distort,d);rect(uv,vec4(0,16,3,1),shift,phi,scale,distort,d);
}
void glyph_q(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(8,2,2,3),shift,phi,scale,distort,d);rect(uv,vec4(9,2,1,14),shift,phi,scale,distort,d);rect(uv,vec4(11,2,1,3),shift,phi,scale,distort,d);rect(uv,vec4(3,3,2,7),shift,phi,scale,distort,d);rect(uv,vec4(3,3,3,3),shift,phi,scale,distort,d);rect(uv,vec4(3,3,9,2),shift,phi,scale,distort,d);rect(uv,vec4(9,3,2,5),shift,phi,scale,distort,d);rect(uv,vec4(2,4,3,5),shift,phi,scale,distort,d);rect(uv,vec4(2,8,8,1),shift,phi,scale,distort,d);rect(uv,vec4(3,8,7,2),shift,phi,scale,distort,d);rect(uv,vec4(5,8,2,3),shift,phi,scale,distort,d);rect(uv,vec4(8,8,1,10),shift,phi,scale,distort,d);rect(uv,vec4(7,14,2,3),shift,phi,scale,distort,d);
}
void glyph_u(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(1,6,1,7),shift,phi,scale,distort,d);rect(uv,vec4(8,6,1,8),shift,phi,scale,distort,d);rect(uv,vec4(7,7,1,8),shift,phi,scale,distort,d);rect(uv,vec4(1,8,2,5),shift,phi,scale,distort,d);rect(uv,vec4(2,8,1,6),shift,phi,scale,distort,d);rect(uv,vec4(1,12,3,1),shift,phi,scale,distort,d);rect(uv,vec4(2,12,2,2),shift,phi,scale,distort,d);rect(uv,vec4(3,12,1,3),shift,phi,scale,distort,d);rect(uv,vec4(7,12,3,2),shift,phi,scale,distort,d);rect(uv,vec4(9,12,1,3),shift,phi,scale,distort,d);rect(uv,vec4(2,13,8,1),shift,phi,scale,distort,d);rect(uv,vec4(3,13,5,2),shift,phi,scale,distort,d);
}
void glyph_a(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(5,6,1,3),shift,phi,scale,distort,d);rect(uv,vec4(5,6,2,2),shift,phi,scale,distort,d);rect(uv,vec4(8,6,1,10),shift,phi,scale,distort,d);rect(uv,vec4(4,7,1,3),shift,phi,scale,distort,d);rect(uv,vec4(4,7,5,1),shift,phi,scale,distort,d);rect(uv,vec4(3,8,1,7),shift,phi,scale,distort,d);rect(uv,vec4(8,8,2,3),shift,phi,scale,distort,d);rect(uv,vec4(2,10,2,5),shift,phi,scale,distort,d);rect(uv,vec4(7,10,2,4),shift,phi,scale,distort,d);rect(uv,vec4(1,11,3,3),shift,phi,scale,distort,d);rect(uv,vec4(1,13,4,1),shift,phi,scale,distort,d);rect(uv,vec4(2,13,3,2),shift,phi,scale,distort,d);rect(uv,vec4(4,13,1,3),shift,phi,scale,distort,d);rect(uv,vec4(6,13,1,2),shift,phi,scale,distort,d);rect(uv,vec4(6,13,4,1),shift,phi,scale,distort,d);rect(uv,vec4(8,13,2,3),shift,phi,scale,distort,d);rect(uv,vec4(2,14,5,1),shift,phi,scale,distort,d);rect(uv,vec4(4,14,2,2),shift,phi,scale,distort,d);
}
void glyph_Q(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(5,1,1,4),shift,phi,scale,distort,d);rect(uv,vec4(5,1,3,3),shift,phi,scale,distort,d);rect(uv,vec4(4,2,2,3),shift,phi,scale,distort,d);rect(uv,vec4(4,2,6,2),shift,phi,scale,distort,d);rect(uv,vec4(9,2,1,3),shift,phi,scale,distort,d);rect(uv,vec4(3,3,1,3),shift,phi,scale,distort,d);rect(uv,vec4(3,3,8,1),shift,phi,scale,distort,d);rect(uv,vec4(9,3,2,2),shift,phi,scale,distort,d);rect(uv,vec4(10,3,1,11),shift,phi,scale,distort,d);rect(uv,vec4(2,4,1,4),shift,phi,scale,distort,d);rect(uv,vec4(1,5,1,10),shift,phi,scale,distort,d);rect(uv,vec4(10,5,2,8),shift,phi,scale,distort,d);rect(uv,vec4(0,7,2,7),shift,phi,scale,distort,d);rect(uv,vec4(6,11,1,3),shift,phi,scale,distort,d);rect(uv,vec4(9,11,1,7),shift,phi,scale,distort,d);rect(uv,vec4(6,12,2,2),shift,phi,scale,distort,d);rect(uv,vec4(7,12,1,4),shift,phi,scale,distort,d);rect(uv,vec4(6,13,5,1),shift,phi,scale,distort,d);rect(uv,vec4(7,13,3,3),shift,phi,scale,distort,d);rect(uv,vec4(8,13,2,4),shift,phi,scale,distort,d);rect(uv,vec4(1,14,2,1),shift,phi,scale,distort,d);rect(uv,vec4(2,14,1,3),shift,phi,scale,distort,d);rect(uv,vec4(2,15,4,2),shift,phi,scale,distort,d);rect(uv,vec4(2,15,9,1),shift,phi,scale,distort,d);rect(uv,vec4(8,15,3,2),shift,phi,scale,distort,d);rect(uv,vec4(9,15,2,3),shift,phi,scale,distort,d);rect(uv,vec4(8,16,4,1),shift,phi,scale,distort,d);rect(uv,vec4(9,16,3,2),shift,phi,scale,distort,d);
}
void glyph_K(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(3,1,1,8),shift,phi,scale,distort,d);rect(uv,vec4(7,2,1,3),shift,phi,scale,distort,d);rect(uv,vec4(7,2,2,2),shift,phi,scale,distort,d);rect(uv,vec4(7,2,4,1),shift,phi,scale,distort,d);rect(uv,vec4(2,3,1,9),shift,phi,scale,distort,d);rect(uv,vec4(6,3,1,3),shift,phi,scale,distort,d);rect(uv,vec4(2,5,4,2),shift,phi,scale,distort,d);rect(uv,vec4(1,8,1,8),shift,phi,scale,distort,d);rect(uv,vec4(1,10,4,2),shift,phi,scale,distort,d);rect(uv,vec4(4,10,1,3),shift,phi,scale,distort,d);rect(uv,vec4(0,11,1,7),shift,phi,scale,distort,d);rect(uv,vec4(0,11,7,1),shift,phi,scale,distort,d);rect(uv,vec4(4,11,3,2),shift,phi,scale,distort,d);rect(uv,vec4(6,11,1,3),shift,phi,scale,distort,d);rect(uv,vec4(4,12,5,1),shift,phi,scale,distort,d);rect(uv,vec4(6,12,3,2),shift,phi,scale,distort,d);rect(uv,vec4(8,12,1,4),shift,phi,scale,distort,d);rect(uv,vec4(8,14,2,2),shift,phi,scale,distort,d);rect(uv,vec4(9,14,1,3),shift,phi,scale,distort,d);rect(uv,vec4(9,16,2,1),shift,phi,scale,distort,d);rect(uv,vec4(10,16,1,2),shift,phi,scale,distort,d);
}
void glyph_F(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(8,0,1,4),shift,phi,scale,distort,d);rect(uv,vec4(3,1,1,12),shift,phi,scale,distort,d);rect(uv,vec4(3,1,2,5),shift,phi,scale,distort,d);rect(uv,vec4(3,1,8,2),shift,phi,scale,distort,d);rect(uv,vec4(8,1,3,3),shift,phi,scale,distort,d);rect(uv,vec4(9,1,1,5),shift,phi,scale,distort,d);rect(uv,vec4(2,2,3,2),shift,phi,scale,distort,d);rect(uv,vec4(2,5,1,12),shift,phi,scale,distort,d);rect(uv,vec4(1,6,3,1),shift,phi,scale,distort,d);rect(uv,vec4(2,8,3,3),shift,phi,scale,distort,d);rect(uv,vec4(6,8,1,3),shift,phi,scale,distort,d);rect(uv,vec4(6,8,3,2),shift,phi,scale,distort,d);rect(uv,vec4(6,8,4,1),shift,phi,scale,distort,d);rect(uv,vec4(2,9,5,2),shift,phi,scale,distort,d);rect(uv,vec4(1,11,1,7),shift,phi,scale,distort,d);rect(uv,vec4(0,15,3,2),shift,phi,scale,distort,d);
}
void glyph_D(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(4,1,3,3),shift,phi,scale,distort,d);rect(uv,vec4(2,2,2,3),shift,phi,scale,distort,d);rect(uv,vec4(2,2,7,2),shift,phi,scale,distort,d);rect(uv,vec4(8,2,1,4),shift,phi,scale,distort,d);rect(uv,vec4(1,3,1,4),shift,phi,scale,distort,d);rect(uv,vec4(1,3,9,1),shift,phi,scale,distort,d);rect(uv,vec4(8,3,2,3),shift,phi,scale,distort,d);rect(uv,vec4(9,3,1,11),shift,phi,scale,distort,d);rect(uv,vec4(0,4,4,1),shift,phi,scale,distort,d);rect(uv,vec4(4,5,1,13),shift,phi,scale,distort,d);rect(uv,vec4(8,5,3,1),shift,phi,scale,distort,d);rect(uv,vec4(9,5,2,5),shift,phi,scale,distort,d);rect(uv,vec4(3,6,2,12),shift,phi,scale,distort,d);rect(uv,vec4(3,6,3,5),shift,phi,scale,distort,d);rect(uv,vec4(8,12,1,4),shift,phi,scale,distort,d);rect(uv,vec4(7,14,1,3),shift,phi,scale,distort,d);rect(uv,vec4(2,15,3,1),shift,phi,scale,distort,d);rect(uv,vec4(6,15,2,2),shift,phi,scale,distort,d);rect(uv,vec4(3,16,3,2),shift,phi,scale,distort,d);rect(uv,vec4(0,17,6,1),shift,phi,scale,distort,d);
}
void glyph_C(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(5,1,1,2),shift,phi,scale,distort,d);rect(uv,vec4(5,1,4,1),shift,phi,scale,distort,d);rect(uv,vec4(8,1,1,2),shift,phi,scale,distort,d);rect(uv,vec4(3,2,1,4),shift,phi,scale,distort,d);rect(uv,vec4(3,2,2,3),shift,phi,scale,distort,d);rect(uv,vec4(8,2,2,1),shift,phi,scale,distort,d);rect(uv,vec4(9,2,1,2),shift,phi,scale,distort,d);rect(uv,vec4(9,3,2,1),shift,phi,scale,distort,d);rect(uv,vec4(10,3,1,3),shift,phi,scale,distort,d);rect(uv,vec4(2,4,1,12),shift,phi,scale,distort,d);rect(uv,vec4(1,6,2,8),shift,phi,scale,distort,d);rect(uv,vec4(10,9,1,4),shift,phi,scale,distort,d);rect(uv,vec4(9,11,1,4),shift,phi,scale,distort,d);rect(uv,vec4(1,13,3,1),shift,phi,scale,distort,d);rect(uv,vec4(2,13,2,3),shift,phi,scale,distort,d);rect(uv,vec4(3,13,1,4),shift,phi,scale,distort,d);rect(uv,vec4(8,13,1,3),shift,phi,scale,distort,d);rect(uv,vec4(2,14,3,2),shift,phi,scale,distort,d);rect(uv,vec4(3,14,2,3),shift,phi,scale,distort,d);rect(uv,vec4(7,14,1,3),shift,phi,scale,distort,d);rect(uv,vec4(2,15,7,1),shift,phi,scale,distort,d);rect(uv,vec4(3,15,5,2),shift,phi,scale,distort,d);
}
void glyph_B(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(3,1,4,2),shift,phi,scale,distort,d);rect(uv,vec4(4,1,1,14),shift,phi,scale,distort,d);rect(uv,vec4(4,1,2,6),shift,phi,scale,distort,d);rect(uv,vec4(1,2,9,1),shift,phi,scale,distort,d);rect(uv,vec4(7,2,3,2),shift,phi,scale,distort,d);rect(uv,vec4(3,4,2,11),shift,phi,scale,distort,d);rect(uv,vec4(10,4,1,5),shift,phi,scale,distort,d);rect(uv,vec4(10,5,2,3),shift,phi,scale,distort,d);rect(uv,vec4(2,7,3,4),shift,phi,scale,distort,d);rect(uv,vec4(8,7,1,5),shift,phi,scale,distort,d);rect(uv,vec4(8,7,2,3),shift,phi,scale,distort,d);rect(uv,vec4(6,8,4,2),shift,phi,scale,distort,d);rect(uv,vec4(7,8,2,3),shift,phi,scale,distort,d);rect(uv,vec4(2,9,8,1),shift,phi,scale,distort,d);rect(uv,vec4(8,11,3,1),shift,phi,scale,distort,d);rect(uv,vec4(9,11,1,5),shift,phi,scale,distort,d);rect(uv,vec4(9,11,2,4),shift,phi,scale,distort,d);rect(uv,vec4(2,13,1,4),shift,phi,scale,distort,d);rect(uv,vec4(8,13,1,4),shift,phi,scale,distort,d);rect(uv,vec4(7,14,2,3),shift,phi,scale,distort,d);rect(uv,vec4(0,15,3,2),shift,phi,scale,distort,d);rect(uv,vec4(0,16,9,1),shift,phi,scale,distort,d);rect(uv,vec4(4,16,3,2),shift,phi,scale,distort,d);
}
void glyph_A(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(7,1,1,5),shift,phi,scale,distort,d);rect(uv,vec4(6,2,1,6),shift,phi,scale,distort,d);rect(uv,vec4(6,3,3,3),shift,phi,scale,distort,d);rect(uv,vec4(8,3,1,15),shift,phi,scale,distort,d);rect(uv,vec4(5,5,1,7),shift,phi,scale,distort,d);rect(uv,vec4(8,6,2,12),shift,phi,scale,distort,d);rect(uv,vec4(4,7,1,6),shift,phi,scale,distort,d);rect(uv,vec4(2,9,4,1),shift,phi,scale,distort,d);rect(uv,vec4(3,9,3,2),shift,phi,scale,distort,d);rect(uv,vec4(3,10,7,1),shift,phi,scale,distort,d);rect(uv,vec4(4,10,6,2),shift,phi,scale,distort,d);rect(uv,vec4(7,10,3,3),shift,phi,scale,distort,d);rect(uv,vec4(4,11,7,1),shift,phi,scale,distort,d);rect(uv,vec4(7,11,4,2),shift,phi,scale,distort,d);rect(uv,vec4(2,12,1,4),shift,phi,scale,distort,d);rect(uv,vec4(2,12,2,2),shift,phi,scale,distort,d);rect(uv,vec4(8,14,3,3),shift,phi,scale,distort,d);rect(uv,vec4(1,15,1,3),shift,phi,scale,distort,d);
}
void glyph_G(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(6,2,3,3),shift,phi,scale,distort,d);rect(uv,vec4(4,3,1,4),shift,phi,scale,distort,d);rect(uv,vec4(4,3,2,3),shift,phi,scale,distort,d);rect(uv,vec4(4,3,7,2),shift,phi,scale,distort,d);rect(uv,vec4(9,3,2,3),shift,phi,scale,distort,d);rect(uv,vec4(3,4,1,11),shift,phi,scale,distort,d);rect(uv,vec4(2,6,2,8),shift,phi,scale,distort,d);rect(uv,vec4(9,9,1,3),shift,phi,scale,distort,d);rect(uv,vec4(8,10,1,7),shift,phi,scale,distort,d);rect(uv,vec4(7,11,1,7),shift,phi,scale,distort,d);rect(uv,vec4(2,13,8,1),shift,phi,scale,distort,d);rect(uv,vec4(3,13,7,2),shift,phi,scale,distort,d);
}
void glyph_H(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(4,1,1,6),shift,phi,scale,distort,d);rect(uv,vec4(10,1,1,7),shift,phi,scale,distort,d);rect(uv,vec4(3,3,1,10),shift,phi,scale,distort,d);rect(uv,vec4(9,3,1,8),shift,phi,scale,distort,d);rect(uv,vec4(2,5,1,11),shift,phi,scale,distort,d);rect(uv,vec4(8,6,1,10),shift,phi,scale,distort,d);rect(uv,vec4(6,8,4,2),shift,phi,scale,distort,d);rect(uv,vec4(7,8,1,9),shift,phi,scale,distort,d);rect(uv,vec4(2,9,4,2),shift,phi,scale,distort,d);rect(uv,vec4(1,10,1,7),shift,phi,scale,distort,d);rect(uv,vec4(7,13,3,2),shift,phi,scale,distort,d);rect(uv,vec4(0,15,1,3),shift,phi,scale,distort,d);
}
void glyph_I(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(3,1,7,2),shift,phi,scale,distort,d);rect(uv,vec4(6,1,1,9),shift,phi,scale,distort,d);rect(uv,vec4(6,1,2,4),shift,phi,scale,distort,d);rect(uv,vec4(1,2,10,1),shift,phi,scale,distort,d);rect(uv,vec4(5,4,1,13),shift,phi,scale,distort,d);rect(uv,vec4(4,8,2,9),shift,phi,scale,distort,d);rect(uv,vec4(2,15,6,2),shift,phi,scale,distort,d);rect(uv,vec4(2,15,8,1),shift,phi,scale,distort,d);rect(uv,vec4(0,16,8,1),shift,phi,scale,distort,d);
}
void glyph_J(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(8,1,2,3),shift,phi,scale,distort,d);rect(uv,vec4(9,1,1,8),shift,phi,scale,distort,d);rect(uv,vec4(2,2,1,6),shift,phi,scale,distort,d);rect(uv,vec4(2,2,2,3),shift,phi,scale,distort,d);rect(uv,vec4(2,2,8,2),shift,phi,scale,distort,d);rect(uv,vec4(2,2,9,1),shift,phi,scale,distort,d);rect(uv,vec4(1,3,9,1),shift,phi,scale,distort,d);rect(uv,vec4(8,5,1,6),shift,phi,scale,distort,d);rect(uv,vec4(7,8,1,5),shift,phi,scale,distort,d);rect(uv,vec4(1,10,1,4),shift,phi,scale,distort,d);rect(uv,vec4(6,11,1,4),shift,phi,scale,distort,d);rect(uv,vec4(1,12,2,2),shift,phi,scale,distort,d);rect(uv,vec4(2,12,1,3),shift,phi,scale,distort,d);rect(uv,vec4(1,13,3,1),shift,phi,scale,distort,d);rect(uv,vec4(2,13,2,2),shift,phi,scale,distort,d);rect(uv,vec4(3,13,1,3),shift,phi,scale,distort,d);rect(uv,vec4(5,13,1,3),shift,phi,scale,distort,d);rect(uv,vec4(2,14,5,1),shift,phi,scale,distort,d);rect(uv,vec4(3,14,3,2),shift,phi,scale,distort,d);
}
void glyph_L(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(5,2,1,5),shift,phi,scale,distort,d);rect(uv,vec4(5,2,2,1),shift,phi,scale,distort,d);rect(uv,vec4(4,3,1,7),shift,phi,scale,distort,d);rect(uv,vec4(3,6,1,11),shift,phi,scale,distort,d);rect(uv,vec4(2,8,2,9),shift,phi,scale,distort,d);rect(uv,vec4(7,13,2,3),shift,phi,scale,distort,d);rect(uv,vec4(7,13,3,2),shift,phi,scale,distort,d);rect(uv,vec4(2,14,3,3),shift,phi,scale,distort,d);rect(uv,vec4(2,14,7,2),shift,phi,scale,distort,d);rect(uv,vec4(2,14,9,1),shift,phi,scale,distort,d);rect(uv,vec4(1,15,8,1),shift,phi,scale,distort,d);
}
void glyph_M(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(11,2,1,5),shift,phi,scale,distort,d);rect(uv,vec4(11,2,3,4),shift,phi,scale,distort,d);rect(uv,vec4(13,2,1,7),shift,phi,scale,distort,d);rect(uv,vec4(6,3,1,6),shift,phi,scale,distort,d);rect(uv,vec4(6,3,2,5),shift,phi,scale,distort,d);rect(uv,vec4(6,4,3,4),shift,phi,scale,distort,d);rect(uv,vec4(8,4,1,6),shift,phi,scale,distort,d);rect(uv,vec4(5,5,1,5),shift,phi,scale,distort,d);rect(uv,vec4(10,5,1,5),shift,phi,scale,distort,d);rect(uv,vec4(10,5,5,1),shift,phi,scale,distort,d);rect(uv,vec4(13,5,2,4),shift,phi,scale,distort,d);rect(uv,vec4(14,5,1,7),shift,phi,scale,distort,d);rect(uv,vec4(5,6,6,2),shift,phi,scale,distort,d);rect(uv,vec4(8,6,3,4),shift,phi,scale,distort,d);rect(uv,vec4(9,6,1,5),shift,phi,scale,distort,d);rect(uv,vec4(4,7,1,6),shift,phi,scale,distort,d);rect(uv,vec4(13,8,3,1),shift,phi,scale,distort,d);rect(uv,vec4(14,8,2,4),shift,phi,scale,distort,d);rect(uv,vec4(15,8,1,7),shift,phi,scale,distort,d);rect(uv,vec4(3,9,1,6),shift,phi,scale,distort,d);rect(uv,vec4(14,11,3,1),shift,phi,scale,distort,d);rect(uv,vec4(15,11,2,4),shift,phi,scale,distort,d);rect(uv,vec4(16,11,1,6),shift,phi,scale,distort,d);rect(uv,vec4(2,13,1,5),shift,phi,scale,distort,d);rect(uv,vec4(1,14,2,3),shift,phi,scale,distort,d);rect(uv,vec4(15,14,3,1),shift,phi,scale,distort,d);rect(uv,vec4(16,14,2,3),shift,phi,scale,distort,d);rect(uv,vec4(17,14,1,4),shift,phi,scale,distort,d);
}
void glyph_X(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(11,2,1,2),shift,phi,scale,distort,d);rect(uv,vec4(2,3,1,2),shift,phi,scale,distort,d);rect(uv,vec4(10,3,1,2),shift,phi,scale,distort,d);rect(uv,vec4(2,4,2,1),shift,phi,scale,distort,d);rect(uv,vec4(3,4,1,2),shift,phi,scale,distort,d);rect(uv,vec4(4,6,1,2),shift,phi,scale,distort,d);rect(uv,vec4(4,7,2,1),shift,phi,scale,distort,d);rect(uv,vec4(6,8,1,2),shift,phi,scale,distort,d);rect(uv,vec4(7,10,1,2),shift,phi,scale,distort,d);rect(uv,vec4(4,11,1,2),shift,phi,scale,distort,d);rect(uv,vec4(7,11,2,1),shift,phi,scale,distort,d);rect(uv,vec4(8,11,1,3),shift,phi,scale,distort,d);rect(uv,vec4(3,12,2,1),shift,phi,scale,distort,d);rect(uv,vec4(8,13,2,1),shift,phi,scale,distort,d);rect(uv,vec4(9,13,1,5),shift,phi,scale,distort,d);rect(uv,vec4(1,14,1,2),shift,phi,scale,distort,d);rect(uv,vec4(1,2,1,1),shift,phi,scale,distort,d);rect(uv,vec4(9,5,1,1),shift,phi,scale,distort,d);rect(uv,vec4(8,6,1,1),shift,phi,scale,distort,d);rect(uv,vec4(7,7,1,1),shift,phi,scale,distort,d);rect(uv,vec4(5,10,1,1),shift,phi,scale,distort,d);rect(uv,vec4(2,13,1,1),shift,phi,scale,distort,d);
}
void glyph_W(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(1,3,2,1),shift,phi,scale,distort,d);rect(uv,vec4(2,3,1,2),shift,phi,scale,distort,d);rect(uv,vec4(2,4,2,1),shift,phi,scale,distort,d);rect(uv,vec4(3,4,1,2),shift,phi,scale,distort,d);rect(uv,vec4(8,4,1,2),shift,phi,scale,distort,d);rect(uv,vec4(8,4,2,1),shift,phi,scale,distort,d);rect(uv,vec4(14,4,1,3),shift,phi,scale,distort,d);rect(uv,vec4(14,4,2,2),shift,phi,scale,distort,d);rect(uv,vec4(7,5,1,11),shift,phi,scale,distort,d);rect(uv,vec4(4,6,1,2),shift,phi,scale,distort,d);rect(uv,vec4(12,6,1,3),shift,phi,scale,distort,d);rect(uv,vec4(12,6,2,2),shift,phi,scale,distort,d);rect(uv,vec4(6,7,2,2),shift,phi,scale,distort,d);rect(uv,vec4(10,7,4,1),shift,phi,scale,distort,d);rect(uv,vec4(11,7,1,4),shift,phi,scale,distort,d);rect(uv,vec4(3,8,1,5),shift,phi,scale,distort,d);rect(uv,vec4(5,8,1,2),shift,phi,scale,distort,d);rect(uv,vec4(10,9,1,4),shift,phi,scale,distort,d);rect(uv,vec4(2,10,1,5),shift,phi,scale,distort,d);rect(uv,vec4(2,10,3,1),shift,phi,scale,distort,d);rect(uv,vec4(9,10,1,4),shift,phi,scale,distort,d);rect(uv,vec4(7,12,2,4),shift,phi,scale,distort,d);rect(uv,vec4(1,13,1,4),shift,phi,scale,distort,d);rect(uv,vec4(6,15,3,1),shift,phi,scale,distort,d);
}
void glyph_V(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(1,1,1,4),shift,phi,scale,distort,d);rect(uv,vec4(0,2,2,1),shift,phi,scale,distort,d);rect(uv,vec4(9,2,1,5),shift,phi,scale,distort,d);rect(uv,vec4(9,2,2,2),shift,phi,scale,distort,d);rect(uv,vec4(1,3,2,2),shift,phi,scale,distort,d);rect(uv,vec4(2,3,1,10),shift,phi,scale,distort,d);rect(uv,vec4(8,3,1,6),shift,phi,scale,distort,d);rect(uv,vec4(8,3,4,1),shift,phi,scale,distort,d);rect(uv,vec4(1,6,2,3),shift,phi,scale,distort,d);rect(uv,vec4(1,7,3,2),shift,phi,scale,distort,d);rect(uv,vec4(2,7,2,6),shift,phi,scale,distort,d);rect(uv,vec4(3,7,1,11),shift,phi,scale,distort,d);rect(uv,vec4(7,7,1,5),shift,phi,scale,distort,d);rect(uv,vec4(6,8,1,5),shift,phi,scale,distort,d);rect(uv,vec4(5,12,1,3),shift,phi,scale,distort,d);rect(uv,vec4(3,13,2,4),shift,phi,scale,distort,d);rect(uv,vec4(2,15,3,2),shift,phi,scale,distort,d);
}
void glyph_U(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(3,2,1,4),shift,phi,scale,distort,d);rect(uv,vec4(3,2,2,1),shift,phi,scale,distort,d);rect(uv,vec4(10,2,1,12),shift,phi,scale,distort,d);rect(uv,vec4(2,3,1,13),shift,phi,scale,distort,d);rect(uv,vec4(9,4,1,13),shift,phi,scale,distort,d);rect(uv,vec4(1,6,2,8),shift,phi,scale,distort,d);rect(uv,vec4(8,9,1,9),shift,phi,scale,distort,d);rect(uv,vec4(7,13,3,2),shift,phi,scale,distort,d);rect(uv,vec4(7,13,5,1),shift,phi,scale,distort,d);rect(uv,vec4(2,14,2,2),shift,phi,scale,distort,d);rect(uv,vec4(3,14,1,3),shift,phi,scale,distort,d);rect(uv,vec4(5,14,1,3),shift,phi,scale,distort,d);rect(uv,vec4(5,14,2,2),shift,phi,scale,distort,d);rect(uv,vec4(2,15,5,1),shift,phi,scale,distort,d);rect(uv,vec4(3,15,3,2),shift,phi,scale,distort,d);
}
void glyph_R(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(3,1,1,14),shift,phi,scale,distort,d);rect(uv,vec4(5,2,4,2),shift,phi,scale,distort,d);rect(uv,vec4(8,2,1,3),shift,phi,scale,distort,d);rect(uv,vec4(2,3,8,1),shift,phi,scale,distort,d);rect(uv,vec4(3,3,2,8),shift,phi,scale,distort,d);rect(uv,vec4(8,3,2,2),shift,phi,scale,distort,d);rect(uv,vec4(9,3,1,6),shift,phi,scale,distort,d);rect(uv,vec4(8,4,3,1),shift,phi,scale,distort,d);rect(uv,vec4(9,4,2,4),shift,phi,scale,distort,d);rect(uv,vec4(8,7,1,3),shift,phi,scale,distort,d);rect(uv,vec4(7,8,2,2),shift,phi,scale,distort,d);rect(uv,vec4(3,9,4,2),shift,phi,scale,distort,d);rect(uv,vec4(5,9,2,3),shift,phi,scale,distort,d);rect(uv,vec4(6,9,1,4),shift,phi,scale,distort,d);rect(uv,vec4(2,10,1,7),shift,phi,scale,distort,d);rect(uv,vec4(6,12,2,1),shift,phi,scale,distort,d);rect(uv,vec4(7,12,1,3),shift,phi,scale,distort,d);rect(uv,vec4(1,13,2,4),shift,phi,scale,distort,d);rect(uv,vec4(7,13,2,2),shift,phi,scale,distort,d);rect(uv,vec4(8,13,1,3),shift,phi,scale,distort,d);rect(uv,vec4(7,14,3,1),shift,phi,scale,distort,d);rect(uv,vec4(8,14,2,2),shift,phi,scale,distort,d);rect(uv,vec4(9,14,1,4),shift,phi,scale,distort,d);rect(uv,vec4(8,15,3,1),shift,phi,scale,distort,d);rect(uv,vec4(9,15,2,2),shift,phi,scale,distort,d);
}
void glyph_kot(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(2,2,1,6),shift,phi,scale,distort,d);rect(uv,vec4(2,3,2,3),shift,phi,scale,distort,d);rect(uv,vec4(1,6,2,2),shift,phi,scale,distort,d);
}
void glyph_S(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(4,1,1,3),shift,phi,scale,distort,d);rect(uv,vec4(4,1,5,2),shift,phi,scale,distort,d);rect(uv,vec4(8,1,1,3),shift,phi,scale,distort,d);rect(uv,vec4(3,2,1,7),shift,phi,scale,distort,d);rect(uv,vec4(3,2,7,1),shift,phi,scale,distort,d);rect(uv,vec4(8,2,2,2),shift,phi,scale,distort,d);rect(uv,vec4(9,2,1,3),shift,phi,scale,distort,d);rect(uv,vec4(2,3,2,5),shift,phi,scale,distort,d);rect(uv,vec4(9,4,2,1),shift,phi,scale,distort,d);rect(uv,vec4(10,4,1,2),shift,phi,scale,distort,d);rect(uv,vec4(2,7,3,1),shift,phi,scale,distort,d);rect(uv,vec4(3,7,2,2),shift,phi,scale,distort,d);rect(uv,vec4(4,7,1,3),shift,phi,scale,distort,d);rect(uv,vec4(3,8,3,1),shift,phi,scale,distort,d);rect(uv,vec4(4,8,2,2),shift,phi,scale,distort,d);rect(uv,vec4(5,8,1,3),shift,phi,scale,distort,d);rect(uv,vec4(4,9,5,1),shift,phi,scale,distort,d);rect(uv,vec4(5,9,4,2),shift,phi,scale,distort,d);rect(uv,vec4(5,10,5,1),shift,phi,scale,distort,d);rect(uv,vec4(9,10,1,2),shift,phi,scale,distort,d);rect(uv,vec4(9,11,2,1),shift,phi,scale,distort,d);rect(uv,vec4(10,11,1,5),shift,phi,scale,distort,d);rect(uv,vec4(1,12,1,3),shift,phi,scale,distort,d);rect(uv,vec4(10,12,2,3),shift,phi,scale,distort,d);rect(uv,vec4(1,13,2,2),shift,phi,scale,distort,d);rect(uv,vec4(1,14,4,1),shift,phi,scale,distort,d);rect(uv,vec4(3,14,2,2),shift,phi,scale,distort,d);rect(uv,vec4(4,14,1,3),shift,phi,scale,distort,d);rect(uv,vec4(9,14,1,3),shift,phi,scale,distort,d);rect(uv,vec4(3,15,8,1),shift,phi,scale,distort,d);rect(uv,vec4(4,15,6,2),shift,phi,scale,distort,d);
}
void glyph_E(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(8,0,1,4),shift,phi,scale,distort,d);rect(uv,vec4(3,1,1,12),shift,phi,scale,distort,d);rect(uv,vec4(3,1,2,5),shift,phi,scale,distort,d);rect(uv,vec4(3,1,8,2),shift,phi,scale,distort,d);rect(uv,vec4(8,1,3,3),shift,phi,scale,distort,d);rect(uv,vec4(9,1,1,5),shift,phi,scale,distort,d);rect(uv,vec4(2,2,3,2),shift,phi,scale,distort,d);rect(uv,vec4(2,5,1,12),shift,phi,scale,distort,d);rect(uv,vec4(1,6,3,1),shift,phi,scale,distort,d);rect(uv,vec4(2,8,3,3),shift,phi,scale,distort,d);rect(uv,vec4(6,8,1,3),shift,phi,scale,distort,d);rect(uv,vec4(6,8,3,2),shift,phi,scale,distort,d);rect(uv,vec4(6,8,4,1),shift,phi,scale,distort,d);rect(uv,vec4(2,9,5,2),shift,phi,scale,distort,d);rect(uv,vec4(1,11,2,6),shift,phi,scale,distort,d);rect(uv,vec4(9,12,1,4),shift,phi,scale,distort,d);rect(uv,vec4(7,13,2,4),shift,phi,scale,distort,d);rect(uv,vec4(6,14,3,3),shift,phi,scale,distort,d);rect(uv,vec4(0,15,10,1),shift,phi,scale,distort,d);rect(uv,vec4(1,15,8,2),shift,phi,scale,distort,d);
}
void glyph_O(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(4,2,1,3),shift,phi,scale,distort,d);rect(uv,vec4(4,2,2,2),shift,phi,scale,distort,d);rect(uv,vec4(4,2,4,1),shift,phi,scale,distort,d);rect(uv,vec4(7,2,1,2),shift,phi,scale,distort,d);rect(uv,vec4(3,3,1,3),shift,phi,scale,distort,d);rect(uv,vec4(7,3,2,1),shift,phi,scale,distort,d);rect(uv,vec4(2,5,1,4),shift,phi,scale,distort,d);rect(uv,vec4(10,5,1,2),shift,phi,scale,distort,d);rect(uv,vec4(1,6,1,8),shift,phi,scale,distort,d);rect(uv,vec4(11,7,1,5),shift,phi,scale,distort,d);rect(uv,vec4(0,9,2,3),shift,phi,scale,distort,d);rect(uv,vec4(0,11,3,1),shift,phi,scale,distort,d);rect(uv,vec4(1,11,2,3),shift,phi,scale,distort,d);rect(uv,vec4(2,11,1,5),shift,phi,scale,distort,d);rect(uv,vec4(10,11,1,3),shift,phi,scale,distort,d);rect(uv,vec4(1,13,3,1),shift,phi,scale,distort,d);rect(uv,vec4(2,13,2,3),shift,phi,scale,distort,d);rect(uv,vec4(3,13,1,4),shift,phi,scale,distort,d);rect(uv,vec4(9,13,1,3),shift,phi,scale,distort,d);rect(uv,vec4(2,14,3,2),shift,phi,scale,distort,d);rect(uv,vec4(3,14,2,3),shift,phi,scale,distort,d);rect(uv,vec4(8,14,2,2),shift,phi,scale,distort,d);rect(uv,vec4(2,15,8,1),shift,phi,scale,distort,d);rect(uv,vec4(3,15,5,2),shift,phi,scale,distort,d);rect(uv,vec4(9,4,1,1),shift,phi,scale,distort,d);
}
void glyph_P(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(3,1,1,12),shift,phi,scale,distort,d);rect(uv,vec4(5,2,4,2),shift,phi,scale,distort,d);rect(uv,vec4(8,2,1,3),shift,phi,scale,distort,d);rect(uv,vec4(2,3,8,1),shift,phi,scale,distort,d);rect(uv,vec4(3,3,2,9),shift,phi,scale,distort,d);rect(uv,vec4(8,3,2,2),shift,phi,scale,distort,d);rect(uv,vec4(9,3,1,6),shift,phi,scale,distort,d);rect(uv,vec4(8,4,3,1),shift,phi,scale,distort,d);rect(uv,vec4(9,4,2,4),shift,phi,scale,distort,d);rect(uv,vec4(8,7,1,3),shift,phi,scale,distort,d);rect(uv,vec4(7,8,2,2),shift,phi,scale,distort,d);rect(uv,vec4(3,9,4,2),shift,phi,scale,distort,d);rect(uv,vec4(2,10,1,5),shift,phi,scale,distort,d);rect(uv,vec4(1,13,1,3),shift,phi,scale,distort,d);rect(uv,vec4(0,15,1,2),shift,phi,scale,distort,d);
}
void glyph_T(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(5,1,1,17),shift,phi,scale,distort,d);rect(uv,vec4(8,1,3,2),shift,phi,scale,distort,d);rect(uv,vec4(8,1,4,1),shift,phi,scale,distort,d);rect(uv,vec4(2,2,1,3),shift,phi,scale,distort,d);rect(uv,vec4(2,2,6,2),shift,phi,scale,distort,d);rect(uv,vec4(5,2,2,12),shift,phi,scale,distort,d);rect(uv,vec4(1,3,2,2),shift,phi,scale,distort,d);rect(uv,vec4(0,4,3,1),shift,phi,scale,distort,d);rect(uv,vec4(4,8,3,5),shift,phi,scale,distort,d);rect(uv,vec4(4,15,2,3),shift,phi,scale,distort,d);
}
void glyph_Z(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(4,2,1,3),shift,phi,scale,distort,d);rect(uv,vec4(10,2,1,3),shift,phi,scale,distort,d);rect(uv,vec4(3,3,2,2),shift,phi,scale,distort,d);rect(uv,vec4(3,3,8,1),shift,phi,scale,distort,d);rect(uv,vec4(9,3,1,3),shift,phi,scale,distort,d);rect(uv,vec4(2,4,1,2),shift,phi,scale,distort,d);rect(uv,vec4(1,5,2,1),shift,phi,scale,distort,d);rect(uv,vec4(7,5,2,2),shift,phi,scale,distort,d);rect(uv,vec4(6,6,1,3),shift,phi,scale,distort,d);rect(uv,vec4(4,8,1,3),shift,phi,scale,distort,d);rect(uv,vec4(4,8,3,1),shift,phi,scale,distort,d);rect(uv,vec4(3,9,1,6),shift,phi,scale,distort,d);rect(uv,vec4(9,11,3,2),shift,phi,scale,distort,d);rect(uv,vec4(11,11,1,3),shift,phi,scale,distort,d);rect(uv,vec4(2,12,1,4),shift,phi,scale,distort,d);rect(uv,vec4(6,12,2,2),shift,phi,scale,distort,d);rect(uv,vec4(6,12,6,1),shift,phi,scale,distort,d);rect(uv,vec4(2,13,3,2),shift,phi,scale,distort,d);rect(uv,vec4(2,13,6,1),shift,phi,scale,distort,d);rect(uv,vec4(1,14,2,2),shift,phi,scale,distort,d);
}
void glyph_minus(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(4,7,2,3),shift,phi,scale,distort,d);rect(uv,vec4(4,7,6,2),shift,phi,scale,distort,d);rect(uv,vec4(4,7,7,1),shift,phi,scale,distort,d);rect(uv,vec4(7,7,1,3),shift,phi,scale,distort,d);rect(uv,vec4(3,8,3,2),shift,phi,scale,distort,d);rect(uv,vec4(1,9,5,1),shift,phi,scale,distort,d);
}
void glyph_colonhehehehe(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(5,5,2,4),shift,phi,scale,distort,d);rect(uv,vec4(5,6,3,2),shift,phi,scale,distort,d);rect(uv,vec4(4,7,3,2),shift,phi,scale,distort,d);rect(uv,vec4(6,12,2,3),shift,phi,scale,distort,d);rect(uv,vec4(6,12,3,2),shift,phi,scale,distort,d);rect(uv,vec4(5,13,4,1),shift,phi,scale,distort,d);
}
void glyph_ampersand(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(4,2,3,2),shift,phi,scale,distort,d);rect(uv,vec4(4,2,4,1),shift,phi,scale,distort,d);rect(uv,vec4(3,3,1,2),shift,phi,scale,distort,d);rect(uv,vec4(8,3,2,1),shift,phi,scale,distort,d);rect(uv,vec4(9,3,1,4),shift,phi,scale,distort,d);rect(uv,vec4(2,4,1,2),shift,phi,scale,distort,d);rect(uv,vec4(1,5,1,3),shift,phi,scale,distort,d);rect(uv,vec4(8,5,1,3),shift,phi,scale,distort,d);rect(uv,vec4(1,7,2,1),shift,phi,scale,distort,d);rect(uv,vec4(2,7,1,5),shift,phi,scale,distort,d);rect(uv,vec4(7,7,1,2),shift,phi,scale,distort,d);rect(uv,vec4(2,8,2,2),shift,phi,scale,distort,d);rect(uv,vec4(5,8,1,4),shift,phi,scale,distort,d);rect(uv,vec4(5,8,3,1),shift,phi,scale,distort,d);rect(uv,vec4(2,9,4,1),shift,phi,scale,distort,d);rect(uv,vec4(4,9,2,2),shift,phi,scale,distort,d);rect(uv,vec4(1,10,1,4),shift,phi,scale,distort,d);rect(uv,vec4(0,11,1,6),shift,phi,scale,distort,d);rect(uv,vec4(5,11,2,1),shift,phi,scale,distort,d);rect(uv,vec4(6,11,1,2),shift,phi,scale,distort,d);rect(uv,vec4(10,11,1,3),shift,phi,scale,distort,d);rect(uv,vec4(10,11,2,2),shift,phi,scale,distort,d);rect(uv,vec4(6,12,2,1),shift,phi,scale,distort,d);rect(uv,vec4(7,12,1,2),shift,phi,scale,distort,d);rect(uv,vec4(9,12,1,5),shift,phi,scale,distort,d);rect(uv,vec4(7,13,4,1),shift,phi,scale,distort,d);rect(uv,vec4(8,13,2,3),shift,phi,scale,distort,d);rect(uv,vec4(0,15,2,2),shift,phi,scale,distort,d);rect(uv,vec4(1,15,1,3),shift,phi,scale,distort,d);rect(uv,vec4(7,15,1,2),shift,phi,scale,distort,d);rect(uv,vec4(7,15,4,1),shift,phi,scale,distort,d);rect(uv,vec4(9,15,2,2),shift,phi,scale,distort,d);rect(uv,vec4(5,16,2,2),shift,phi,scale,distort,d);rect(uv,vec4(9,16,3,1),shift,phi,scale,distort,d);rect(uv,vec4(11,16,1,2),shift,phi,scale,distort,d);rect(uv,vec4(1,17,6,1),shift,phi,scale,distort,d);
}
void glyph_m(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(1,5,1,9),shift,phi,scale,distort,d);rect(uv,vec4(3,6,3,2),shift,phi,scale,distort,d);rect(uv,vec4(8,6,1,2),shift,phi,scale,distort,d);rect(uv,vec4(0,7,1,8),shift,phi,scale,distort,d);rect(uv,vec4(0,7,3,2),shift,phi,scale,distort,d);rect(uv,vec4(0,7,11,1),shift,phi,scale,distort,d);rect(uv,vec4(6,7,1,7),shift,phi,scale,distort,d);rect(uv,vec4(6,7,2,2),shift,phi,scale,distort,d);rect(uv,vec4(9,7,2,2),shift,phi,scale,distort,d);rect(uv,vec4(10,7,1,8),shift,phi,scale,distort,d);rect(uv,vec4(9,8,3,1),shift,phi,scale,distort,d);rect(uv,vec4(10,8,2,5),shift,phi,scale,distort,d);rect(uv,vec4(5,9,1,6),shift,phi,scale,distort,d);rect(uv,vec4(9,13,2,2),shift,phi,scale,distort,d);
}
void glyph_questschn(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(5,0,5,2),shift,phi,scale,distort,d);rect(uv,vec4(9,0,1,9),shift,phi,scale,distort,d);rect(uv,vec4(3,1,1,2),shift,phi,scale,distort,d);rect(uv,vec4(3,1,7,1),shift,phi,scale,distort,d);rect(uv,vec4(2,2,1,5),shift,phi,scale,distort,d);rect(uv,vec4(9,2,2,5),shift,phi,scale,distort,d);rect(uv,vec4(1,3,2,4),shift,phi,scale,distort,d);rect(uv,vec4(1,4,3,2),shift,phi,scale,distort,d);rect(uv,vec4(8,6,1,4),shift,phi,scale,distort,d);rect(uv,vec4(7,8,1,3),shift,phi,scale,distort,d);rect(uv,vec4(6,9,1,5),shift,phi,scale,distort,d);rect(uv,vec4(5,10,2,3),shift,phi,scale,distort,d);rect(uv,vec4(5,15,2,2),shift,phi,scale,distort,d);rect(uv,vec4(5,15,3,1),shift,phi,scale,distort,d);
}
void glyph_x(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(2,8,2,1),shift,phi,scale,distort,d);rect(uv,vec4(3,8,1,2),shift,phi,scale,distort,d);rect(uv,vec4(8,8,2,2),shift,phi,scale,distort,d);rect(uv,vec4(8,8,3,1),shift,phi,scale,distort,d);rect(uv,vec4(3,9,3,1),shift,phi,scale,distort,d);rect(uv,vec4(4,9,2,2),shift,phi,scale,distort,d);rect(uv,vec4(5,9,1,4),shift,phi,scale,distort,d);rect(uv,vec4(7,9,1,2),shift,phi,scale,distort,d);rect(uv,vec4(4,10,4,1),shift,phi,scale,distort,d);rect(uv,vec4(5,10,2,3),shift,phi,scale,distort,d);rect(uv,vec4(5,12,4,1),shift,phi,scale,distort,d);rect(uv,vec4(7,12,2,2),shift,phi,scale,distort,d);rect(uv,vec4(8,12,1,3),shift,phi,scale,distort,d);rect(uv,vec4(3,13,1,4),shift,phi,scale,distort,d);rect(uv,vec4(3,13,2,1),shift,phi,scale,distort,d);rect(uv,vec4(7,13,3,1),shift,phi,scale,distort,d);rect(uv,vec4(8,13,2,2),shift,phi,scale,distort,d);rect(uv,vec4(9,13,1,4),shift,phi,scale,distort,d);rect(uv,vec4(2,14,2,3),shift,phi,scale,distort,d);rect(uv,vec4(8,14,3,1),shift,phi,scale,distort,d);rect(uv,vec4(9,14,2,2),shift,phi,scale,distort,d);rect(uv,vec4(2,15,3,1),shift,phi,scale,distort,d);
}
void glyph_t(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(5,2,1,9),shift,phi,scale,distort,d);rect(uv,vec4(3,5,5,2),shift,phi,scale,distort,d);rect(uv,vec4(3,5,6,1),shift,phi,scale,distort,d);rect(uv,vec4(4,5,1,9),shift,phi,scale,distort,d);rect(uv,vec4(1,6,7,1),shift,phi,scale,distort,d);rect(uv,vec4(3,10,1,6),shift,phi,scale,distort,d);
}
void glyph_eggsclamation(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(1,0,1,10),shift,phi,scale,distort,d);rect(uv,vec4(3,0,1,5),shift,phi,scale,distort,d);rect(uv,vec4(3,0,2,1),shift,phi,scale,distort,d);rect(uv,vec4(1,1,2,9),shift,phi,scale,distort,d);rect(uv,vec4(1,6,3,2),shift,phi,scale,distort,d);rect(uv,vec4(2,12,1,3),shift,phi,scale,distort,d);rect(uv,vec4(2,12,2,2),shift,phi,scale,distort,d);rect(uv,vec4(1,13,2,2),shift,phi,scale,distort,d);
}
void glyph_w(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(1,7,1,3),shift,phi,scale,distort,d);rect(uv,vec4(7,7,1,4),shift,phi,scale,distort,d);rect(uv,vec4(13,7,1,3),shift,phi,scale,distort,d);rect(uv,vec4(13,7,2,2),shift,phi,scale,distort,d);rect(uv,vec4(0,8,3,1),shift,phi,scale,distort,d);rect(uv,vec4(1,8,2,2),shift,phi,scale,distort,d);rect(uv,vec4(2,8,1,4),shift,phi,scale,distort,d);rect(uv,vec4(7,8,2,3),shift,phi,scale,distort,d);rect(uv,vec4(8,8,1,4),shift,phi,scale,distort,d);rect(uv,vec4(12,8,1,4),shift,phi,scale,distort,d);rect(uv,vec4(12,8,4,1),shift,phi,scale,distort,d);rect(uv,vec4(6,9,1,3),shift,phi,scale,distort,d);rect(uv,vec4(2,10,2,2),shift,phi,scale,distort,d);rect(uv,vec4(3,10,1,4),shift,phi,scale,distort,d);rect(uv,vec4(6,10,4,1),shift,phi,scale,distort,d);rect(uv,vec4(8,10,2,2),shift,phi,scale,distort,d);rect(uv,vec4(9,10,1,3),shift,phi,scale,distort,d);rect(uv,vec4(11,10,1,4),shift,phi,scale,distort,d);rect(uv,vec4(5,11,1,4),shift,phi,scale,distort,d);rect(uv,vec4(8,11,5,1),shift,phi,scale,distort,d);rect(uv,vec4(9,11,3,2),shift,phi,scale,distort,d);rect(uv,vec4(10,11,1,4),shift,phi,scale,distort,d);rect(uv,vec4(3,12,3,2),shift,phi,scale,distort,d);rect(uv,vec4(4,12,1,4),shift,phi,scale,distort,d);
}
void glyph_y(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(11,6,1,5),shift,phi,scale,distort,d);rect(uv,vec4(3,7,2,1),shift,phi,scale,distort,d);rect(uv,vec4(4,7,1,2),shift,phi,scale,distort,d);rect(uv,vec4(10,7,1,5),shift,phi,scale,distort,d);rect(uv,vec4(4,8,2,1),shift,phi,scale,distort,d);rect(uv,vec4(5,8,1,3),shift,phi,scale,distort,d);rect(uv,vec4(5,9,3,2),shift,phi,scale,distort,d);rect(uv,vec4(6,9,2,3),shift,phi,scale,distort,d);rect(uv,vec4(7,9,1,7),shift,phi,scale,distort,d);rect(uv,vec4(9,9,1,5),shift,phi,scale,distort,d);rect(uv,vec4(5,10,7,1),shift,phi,scale,distort,d);rect(uv,vec4(6,10,5,2),shift,phi,scale,distort,d);rect(uv,vec4(7,10,2,5),shift,phi,scale,distort,d);rect(uv,vec4(5,14,1,4),shift,phi,scale,distort,d);rect(uv,vec4(5,14,3,2),shift,phi,scale,distort,d);rect(uv,vec4(4,16,2,2),shift,phi,scale,distort,d);
}
void glyph_l(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(7,2,1,2),shift,phi,scale,distort,d);rect(uv,vec4(6,3,1,5),shift,phi,scale,distort,d);rect(uv,vec4(5,5,1,7),shift,phi,scale,distort,d);rect(uv,vec4(4,8,1,9),shift,phi,scale,distort,d);rect(uv,vec4(3,11,2,5),shift,phi,scale,distort,d);rect(uv,vec4(7,14,1,3),shift,phi,scale,distort,d);rect(uv,vec4(7,14,2,2),shift,phi,scale,distort,d);rect(uv,vec4(7,14,3,1),shift,phi,scale,distort,d);rect(uv,vec4(3,15,6,1),shift,phi,scale,distort,d);rect(uv,vec4(4,15,4,2),shift,phi,scale,distort,d);
}
void glyph_b(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(2,3,2,2),shift,phi,scale,distort,d);rect(uv,vec4(3,3,1,3),shift,phi,scale,distort,d);rect(uv,vec4(2,4,3,1),shift,phi,scale,distort,d);rect(uv,vec4(3,4,2,2),shift,phi,scale,distort,d);rect(uv,vec4(4,4,1,13),shift,phi,scale,distort,d);rect(uv,vec4(3,5,3,1),shift,phi,scale,distort,d);rect(uv,vec4(4,5,2,4),shift,phi,scale,distort,d);rect(uv,vec4(7,9,2,2),shift,phi,scale,distort,d);rect(uv,vec4(4,10,2,4),shift,phi,scale,distort,d);rect(uv,vec4(4,10,5,1),shift,phi,scale,distort,d);rect(uv,vec4(9,11,1,2),shift,phi,scale,distort,d);rect(uv,vec4(3,12,2,5),shift,phi,scale,distort,d);rect(uv,vec4(9,12,2,1),shift,phi,scale,distort,d);rect(uv,vec4(10,12,1,4),shift,phi,scale,distort,d);rect(uv,vec4(2,14,3,3),shift,phi,scale,distort,d);rect(uv,vec4(2,15,4,2),shift,phi,scale,distort,d);rect(uv,vec4(9,15,1,2),shift,phi,scale,distort,d);rect(uv,vec4(1,16,9,1),shift,phi,scale,distort,d);
}
void glyph_j(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){

}
void glyph_p(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(5,6,1,8),shift,phi,scale,distort,d);rect(uv,vec4(7,6,2,2),shift,phi,scale,distort,d);rect(uv,vec4(7,6,4,1),shift,phi,scale,distort,d);rect(uv,vec4(4,7,2,3),shift,phi,scale,distort,d);rect(uv,vec4(4,7,5,1),shift,phi,scale,distort,d);rect(uv,vec4(11,7,1,4),shift,phi,scale,distort,d);rect(uv,vec4(9,10,1,3),shift,phi,scale,distort,d);rect(uv,vec4(9,10,2,2),shift,phi,scale,distort,d);rect(uv,vec4(4,11,1,5),shift,phi,scale,distort,d);rect(uv,vec4(7,11,3,2),shift,phi,scale,distort,d);rect(uv,vec4(4,12,3,2),shift,phi,scale,distort,d);rect(uv,vec4(3,13,1,5),shift,phi,scale,distort,d);rect(uv,vec4(2,16,2,2),shift,phi,scale,distort,d);
}
void glyph_i(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(3,4,1,3),shift,phi,scale,distort,d);rect(uv,vec4(2,5,2,2),shift,phi,scale,distort,d);rect(uv,vec4(2,9,1,7),shift,phi,scale,distort,d);rect(uv,vec4(1,10,2,6),shift,phi,scale,distort,d);rect(uv,vec4(1,11,3,3),shift,phi,scale,distort,d);
}
void glyph_c(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(4,6,2,2),shift,phi,scale,distort,d);rect(uv,vec4(3,7,1,2),shift,phi,scale,distort,d);rect(uv,vec4(3,7,5,1),shift,phi,scale,distort,d);rect(uv,vec4(7,7,1,2),shift,phi,scale,distort,d);rect(uv,vec4(2,8,1,5),shift,phi,scale,distort,d);rect(uv,vec4(1,9,1,7),shift,phi,scale,distort,d);rect(uv,vec4(0,11,2,4),shift,phi,scale,distort,d);rect(uv,vec4(0,14,3,1),shift,phi,scale,distort,d);rect(uv,vec4(1,14,2,2),shift,phi,scale,distort,d);rect(uv,vec4(6,14,1,2),shift,phi,scale,distort,d);rect(uv,vec4(6,14,2,1),shift,phi,scale,distort,d);rect(uv,vec4(1,15,6,1),shift,phi,scale,distort,d);
}
void glyph_s(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(4,6,1,4),shift,phi,scale,distort,d);rect(uv,vec4(4,6,5,1),shift,phi,scale,distort,d);rect(uv,vec4(3,7,2,2),shift,phi,scale,distort,d);rect(uv,vec4(4,9,2,1),shift,phi,scale,distort,d);rect(uv,vec4(5,9,1,2),shift,phi,scale,distort,d);rect(uv,vec4(5,10,3,1),shift,phi,scale,distort,d);rect(uv,vec4(7,10,1,5),shift,phi,scale,distort,d);rect(uv,vec4(7,11,2,3),shift,phi,scale,distort,d);rect(uv,vec4(1,13,1,2),shift,phi,scale,distort,d);rect(uv,vec4(6,13,2,2),shift,phi,scale,distort,d);rect(uv,vec4(1,14,7,1),shift,phi,scale,distort,d);rect(uv,vec4(3,14,3,2),shift,phi,scale,distort,d);rect(uv,vec4(9,7,1,1),shift,phi,scale,distort,d);
}
void glyph_z(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(4,7,2,2),shift,phi,scale,distort,d);rect(uv,vec4(4,7,4,1),shift,phi,scale,distort,d);rect(uv,vec4(7,7,1,2),shift,phi,scale,distort,d);rect(uv,vec4(9,7,1,3),shift,phi,scale,distort,d);rect(uv,vec4(9,7,2,1),shift,phi,scale,distort,d);rect(uv,vec4(2,8,1,2),shift,phi,scale,distort,d);rect(uv,vec4(2,8,4,1),shift,phi,scale,distort,d);rect(uv,vec4(7,8,3,1),shift,phi,scale,distort,d);rect(uv,vec4(8,8,1,3),shift,phi,scale,distort,d);rect(uv,vec4(7,10,1,2),shift,phi,scale,distort,d);rect(uv,vec4(6,11,1,2),shift,phi,scale,distort,d);rect(uv,vec4(5,12,1,2),shift,phi,scale,distort,d);rect(uv,vec4(4,13,1,4),shift,phi,scale,distort,d);rect(uv,vec4(9,13,1,2),shift,phi,scale,distort,d);rect(uv,vec4(9,13,3,1),shift,phi,scale,distort,d);rect(uv,vec4(3,14,2,3),shift,phi,scale,distort,d);rect(uv,vec4(6,14,1,2),shift,phi,scale,distort,d);rect(uv,vec4(6,14,4,1),shift,phi,scale,distort,d);rect(uv,vec4(2,15,1,3),shift,phi,scale,distort,d);rect(uv,vec4(2,15,4,2),shift,phi,scale,distort,d);rect(uv,vec4(1,16,5,1),shift,phi,scale,distort,d);
}
void glyph_r(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(5,6,1,2),shift,phi,scale,distort,d);rect(uv,vec4(1,7,1,6),shift,phi,scale,distort,d);rect(uv,vec4(4,7,1,2),shift,phi,scale,distort,d);rect(uv,vec4(4,7,3,1),shift,phi,scale,distort,d);rect(uv,vec4(1,8,2,5),shift,phi,scale,distort,d);rect(uv,vec4(1,8,3,2),shift,phi,scale,distort,d);rect(uv,vec4(2,8,1,7),shift,phi,scale,distort,d);
}
void glyph_f(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(6,2,1,2),shift,phi,scale,distort,d);rect(uv,vec4(6,2,3,1),shift,phi,scale,distort,d);rect(uv,vec4(8,2,1,2),shift,phi,scale,distort,d);rect(uv,vec4(5,3,1,2),shift,phi,scale,distort,d);rect(uv,vec4(8,3,2,1),shift,phi,scale,distort,d);rect(uv,vec4(9,3,1,2),shift,phi,scale,distort,d);rect(uv,vec4(4,4,1,8),shift,phi,scale,distort,d);rect(uv,vec4(0,6,8,1),shift,phi,scale,distort,d);rect(uv,vec4(3,6,1,10),shift,phi,scale,distort,d);rect(uv,vec4(7,6,1,2),shift,phi,scale,distort,d);rect(uv,vec4(7,7,2,1),shift,phi,scale,distort,d);rect(uv,vec4(2,11,1,7),shift,phi,scale,distort,d);
}
void glyph_h(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(2,3,1,5),shift,phi,scale,distort,d);rect(uv,vec4(2,5,2,3),shift,phi,scale,distort,d);rect(uv,vec4(3,5,1,9),shift,phi,scale,distort,d);rect(uv,vec4(2,7,3,1),shift,phi,scale,distort,d);rect(uv,vec4(3,7,2,4),shift,phi,scale,distort,d);rect(uv,vec4(3,9,5,1),shift,phi,scale,distort,d);rect(uv,vec4(7,9,1,2),shift,phi,scale,distort,d);rect(uv,vec4(2,10,1,6),shift,phi,scale,distort,d);rect(uv,vec4(7,10,2,1),shift,phi,scale,distort,d);rect(uv,vec4(8,10,1,6),shift,phi,scale,distort,d);rect(uv,vec4(8,11,2,4),shift,phi,scale,distort,d);rect(uv,vec4(1,12,3,1),shift,phi,scale,distort,d);
}
void glyph_d(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(9,1,1,4),shift,phi,scale,distort,d);rect(uv,vec4(9,1,2,1),shift,phi,scale,distort,d);rect(uv,vec4(8,3,1,14),shift,phi,scale,distort,d);rect(uv,vec4(7,5,2,10),shift,phi,scale,distort,d);rect(uv,vec4(7,6,3,1),shift,phi,scale,distort,d);rect(uv,vec4(4,8,1,3),shift,phi,scale,distort,d);rect(uv,vec4(4,8,2,2),shift,phi,scale,distort,d);rect(uv,vec4(3,9,1,3),shift,phi,scale,distort,d);rect(uv,vec4(3,9,6,1),shift,phi,scale,distort,d);rect(uv,vec4(6,9,3,2),shift,phi,scale,distort,d);rect(uv,vec4(2,10,1,6),shift,phi,scale,distort,d);rect(uv,vec4(1,11,2,4),shift,phi,scale,distort,d);rect(uv,vec4(5,14,1,3),shift,phi,scale,distort,d);rect(uv,vec4(5,14,2,2),shift,phi,scale,distort,d);rect(uv,vec4(2,15,5,1),shift,phi,scale,distort,d);rect(uv,vec4(3,15,3,2),shift,phi,scale,distort,d);rect(uv,vec4(8,16,2,1),shift,phi,scale,distort,d);
}
void glyph_g(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(10,5,1,7),shift,phi,scale,distort,d);
    rect(uv,vec4(6,6,3,2),shift,phi,scale,distort,d);
    rect(uv,vec4(5,7,1,2),shift,phi,scale,distort,d);
    rect(uv,vec4(5,7,6,1),shift,phi,scale,distort,d);
    rect(uv,vec4(4,8,1,4),shift,phi,scale,distort,d);
    rect(uv,vec4(10,8,2,2),shift,phi,scale,distort,d);rect(uv,vec4(9,9,1,5),shift,phi,scale,distort,d);rect(uv,vec4(3,10,2,2),shift,phi,scale,distort,d);rect(uv,vec4(7,10,1,2),shift,phi,scale,distort,d);rect(uv,vec4(3,11,5,1),shift,phi,scale,distort,d);rect(uv,vec4(5,11,2,2),shift,phi,scale,distort,d);rect(uv,vec4(8,13,1,3),shift,phi,scale,distort,d);rect(uv,vec4(2,14,1,2),shift,phi,scale,distort,d);rect(uv,vec4(2,15,4,1),shift,phi,scale,distort,d);rect(uv,vec4(3,15,3,2),shift,phi,scale,distort,d);
    rect(uv,vec4(7,15,1,2),shift,phi,scale,distort,d);rect(uv,vec4(3,16,5,1),shift,phi,scale,distort,d);
}
void glyph_Y(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(1,3,2,1),shift,phi,scale,distort,d);rect(uv,vec4(2,3,1,2),shift,phi,scale,distort,d);rect(uv,vec4(9,3,1,4),shift,phi,scale,distort,d);rect(uv,vec4(9,3,2,1),shift,phi,scale,distort,d);rect(uv,vec4(2,4,2,1),shift,phi,scale,distort,d);rect(uv,vec4(3,4,1,5),shift,phi,scale,distort,d);rect(uv,vec4(8,5,1,3),shift,phi,scale,distort,d);rect(uv,vec4(3,7,2,2),shift,phi,scale,distort,d);rect(uv,vec4(4,7,1,9),shift,phi,scale,distort,d);rect(uv,vec4(7,7,1,2),shift,phi,scale,distort,d);rect(uv,vec4(6,8,1,2),shift,phi,scale,distort,d);rect(uv,vec4(4,9,2,2),shift,phi,scale,distort,d);rect(uv,vec4(3,12,1,6),shift,phi,scale,distort,d);
}
void glyph_hashtag(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, inout float d){
rect(uv,vec4(4,5,1,9),shift,phi,scale,distort,d);rect(uv,vec4(4,5,2,2),shift,phi,scale,distort,d);rect(uv,vec4(8,5,1,9),shift,phi,scale,distort,d);rect(uv,vec4(8,5,2,2),shift,phi,scale,distort,d);rect(uv,vec4(3,6,2,4),shift,phi,scale,distort,d);rect(uv,vec4(1,8,10,1),shift,phi,scale,distort,d);rect(uv,vec4(7,8,1,7),shift,phi,scale,distort,d);rect(uv,vec4(7,10,4,1),shift,phi,scale,distort,d);rect(uv,vec4(1,11,1,2),shift,phi,scale,distort,d);rect(uv,vec4(1,11,8,1),shift,phi,scale,distort,d);rect(uv,vec4(3,13,1,2),shift,phi,scale,distort,d);
}

    void phrase_dotdotdotlelzeichennolelzeichenevokelelzeichendotdotdot(in vec2 uv, in vec2 shift, in float phi, in float scale, in float distort, in float spac, out float d)
    {d = 1.;
    glyph_dot(uv,shift+vec2(-67.*spac,-9.),phi,scale,distort,d);
    glyph_dot(uv,shift+vec2(-62.*spac,-9.),phi,scale,distort,d);
    glyph_dot(uv,shift+vec2(-57.*spac,-9.),phi,scale,distort,d);
    glyph_lelzeichen(uv,shift+vec2(-51.*spac,-9.),phi,scale,distort,d);
    glyph_n(uv,shift+vec2(-43.*spac,-9.),phi,scale,distort,d);
    glyph_o(uv,shift+vec2(-31.*spac,-9.),phi,scale,distort,d);
    glyph_lelzeichen(uv,shift+vec2(-19.*spac,-9.),phi,scale,distort,d);
    glyph_e(uv,shift+vec2(-11.*spac,-9.),phi,scale,distort,d);
    glyph_v(uv,shift+vec2(-1.*spac,-9.),phi,scale,distort,d);
    glyph_o(uv,shift+vec2(11.*spac,-9.),phi,scale,distort,d);
    glyph_k(uv,shift+vec2(23.*spac,-9.),phi,scale,distort,d);
    glyph_e(uv,shift+vec2(33.*spac,-8.),phi,scale,distort,d);
    glyph_lelzeichen(uv,shift+vec2(43.*spac,-9.),phi,scale,distort,d);
    glyph_dot(uv,shift+vec2(51.*spac,-9.),phi,scale,distort,d);
    glyph_dot(uv,shift+vec2(56.*spac,-9.),phi,scale,distort,d);
    glyph_dot(uv,shift+vec2(61.*spac,-9.),phi,scale,distort,d);
            }
    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
        vec2 uv = (fragCoord.xy-.5*iResolution.xy)/iResolution.y; // qm hack
        
        vec3 col = texture(iChannel0, fragCoord.xy/iResolution.xy).rgb;
        float d;
        float alpha = 1.;
        float blur = 1.;
        
        // TAKE CARE OF THIS
        float t = mod(iTime, 10.);
        float shift_t = 0.;
        
        float y = -52. + 4.4*(t-shift_t) * exp(-.1*(t-shift_t));
        float spac = 1. + 10. * exp(-2.*(t-shift_t));
        float dst = 1.2;
        alpha = .88 * exp(-.5*(t-shift_t));
        phrase_dotdotdotlelzeichennolelzeichenevokelelzeichendotdotdot(uv,vec2(0.,y),0.,spac,dst,spac,d);
        col = mix(col, DARKENING, DARKBORDER * alpha * sm(d-CONTOUR, blur));
        col = mix(col, c.xxx, alpha * sm(d-.005, blur));

        vec2 rndshift;
        lp2dnoise(4.*exp(.2*(t-shift_t))*t, rndshift);
        rndshift *= .007;
        phrase_dotdotdotlelzeichennolelzeichenevokelelzeichendotdotdot(uv-rndshift,vec2(0.,y),0.,spac,dst,spac,d);
        col = mix(col, c.xxx, 3. * alpha * sm(d-.005, blur));
        
        fragColor = vec4(clamp(col,0.,1.),1.); // qm hack fragColor -> fragColor
    }
    
    

void main()
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
