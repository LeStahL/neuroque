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

out vec4 gl_FragColor;

const vec3 c = vec3(1.,0.,-1.);
    

     // nr4 advice: hardcode replace these
    #define PIXEL .005

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
    void lfnoise(in vec2 t, out float n)
    {
        vec2 i = floor(t);
        t = fract(t);
        t = smoothstep(c.yy, c.xx, t);
        vec2 v1, v2;
        rand(i, v1.x);
        rand(i+c.xy, v1.y);
        rand(i+c.yx, v2.x);
        rand(i+c.xx, v2.y);
        v1 = c.zz+2.*mix(v1, v2, t.y);
        n = mix(v1.x, v1.y, t.x);
    }
    void lf2dnoise(in vec2 t, out vec2 n)
    {
        float r1, r2;
        lfnoise(t, r1);
        lfnoise(1.1*t, r2);
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
    void glyph_undefined(in vec2 uv, in vec2 shift, in float phi, in float scale, in float alpha, in float distort, inout float d)
        {rect(uv,vec4(0,0,9,16),shift,phi,scale,distort,d);}
        void glyph_dot(in vec2 uv, in vec2 shift, in float phi, in float scale, in float alpha, in float distort, inout float d){
rect(uv,vec4(2,13,2,3),shift,phi,scale,distort,d);rect(uv,vec4(1,14,3,2),shift,phi,scale,distort,d);rect(uv,vec4(1,14,4,1),shift,phi,scale,distort,d);
}
void glyph_o(in vec2 uv, in vec2 shift, in float phi, in float scale, in float alpha, in float distort, inout float d){
rect(uv,vec4(3,5,1,4),shift,phi,scale,distort,d);rect(uv,vec4(3,5,2,3),shift,phi,scale,distort,d);rect(uv,vec4(3,5,6,2),shift,phi,scale,distort,d);rect(uv,vec4(2,6,1,4),shift,phi,scale,distort,d);rect(uv,vec4(2,6,8,1),shift,phi,scale,distort,d);rect(uv,vec4(9,6,1,7),shift,phi,scale,distort,d);rect(uv,vec4(1,7,1,6),shift,phi,scale,distort,d);rect(uv,vec4(0,8,2,4),shift,phi,scale,distort,d);rect(uv,vec4(9,8,2,4),shift,phi,scale,distort,d);rect(uv,vec4(8,10,2,3),shift,phi,scale,distort,d);rect(uv,vec4(0,11,3,1),shift,phi,scale,distort,d);rect(uv,vec4(1,11,2,2),shift,phi,scale,distort,d);rect(uv,vec4(2,11,1,3),shift,phi,scale,distort,d);rect(uv,vec4(7,11,1,3),shift,phi,scale,distort,d);rect(uv,vec4(5,12,3,2),shift,phi,scale,distort,d);rect(uv,vec4(2,13,6,1),shift,phi,scale,distort,d);
}
void glyph_lelzeichen(in vec2 uv, in vec2 shift, in float phi, in float scale, in float alpha, in float distort, inout float d){

}
void glyph_v(in vec2 uv, in vec2 shift, in float phi, in float scale, in float alpha, in float distort, inout float d){
rect(uv,vec4(10,5,1,3),shift,phi,scale,distort,d);rect(uv,vec4(9,6,1,4),shift,phi,scale,distort,d);rect(uv,vec4(1,7,2,2),shift,phi,scale,distort,d);rect(uv,vec4(2,7,1,3),shift,phi,scale,distort,d);rect(uv,vec4(1,8,3,1),shift,phi,scale,distort,d);rect(uv,vec4(2,8,2,2),shift,phi,scale,distort,d);rect(uv,vec4(3,8,1,4),shift,phi,scale,distort,d);rect(uv,vec4(8,8,1,4),shift,phi,scale,distort,d);rect(uv,vec4(3,10,2,2),shift,phi,scale,distort,d);rect(uv,vec4(4,10,1,4),shift,phi,scale,distort,d);rect(uv,vec4(7,10,1,4),shift,phi,scale,distort,d);rect(uv,vec4(6,11,1,5),shift,phi,scale,distort,d);rect(uv,vec4(4,12,4,2),shift,phi,scale,distort,d);rect(uv,vec4(5,12,1,5),shift,phi,scale,distort,d);
}
void glyph_k(in vec2 uv, in vec2 shift, in float phi, in float scale, in float alpha, in float distort, inout float d){
rect(uv,vec4(4,1,1,7),shift,phi,scale,distort,d);rect(uv,vec4(3,2,1,15),shift,phi,scale,distort,d);rect(uv,vec4(2,6,1,12),shift,phi,scale,distort,d);rect(uv,vec4(8,6,1,2),shift,phi,scale,distort,d);rect(uv,vec4(8,6,2,1),shift,phi,scale,distort,d);rect(uv,vec4(7,7,1,2),shift,phi,scale,distort,d);rect(uv,vec4(6,8,1,3),shift,phi,scale,distort,d);rect(uv,vec4(5,9,1,5),shift,phi,scale,distort,d);rect(uv,vec4(2,11,4,2),shift,phi,scale,distort,d);rect(uv,vec4(2,12,6,1),shift,phi,scale,distort,d);rect(uv,vec4(5,12,3,2),shift,phi,scale,distort,d);rect(uv,vec4(7,12,1,3),shift,phi,scale,distort,d);rect(uv,vec4(7,14,3,1),shift,phi,scale,distort,d);rect(uv,vec4(8,14,2,2),shift,phi,scale,distort,d);rect(uv,vec4(9,14,1,3),shift,phi,scale,distort,d);rect(uv,vec4(9,16,2,1),shift,phi,scale,distort,d);rect(uv,vec4(1,17,2,1),shift,phi,scale,distort,d);
}
void glyph_questschn(in vec2 uv, in vec2 shift, in float phi, in float scale, in float alpha, in float distort, inout float d){
rect(uv,vec4(5,0,5,2),shift,phi,scale,distort,d);rect(uv,vec4(9,0,1,9),shift,phi,scale,distort,d);rect(uv,vec4(3,1,1,2),shift,phi,scale,distort,d);rect(uv,vec4(3,1,7,1),shift,phi,scale,distort,d);rect(uv,vec4(2,2,1,5),shift,phi,scale,distort,d);rect(uv,vec4(9,2,2,5),shift,phi,scale,distort,d);rect(uv,vec4(1,3,2,4),shift,phi,scale,distort,d);rect(uv,vec4(1,4,3,2),shift,phi,scale,distort,d);rect(uv,vec4(8,6,1,4),shift,phi,scale,distort,d);rect(uv,vec4(7,8,1,3),shift,phi,scale,distort,d);rect(uv,vec4(6,9,1,5),shift,phi,scale,distort,d);rect(uv,vec4(5,10,2,3),shift,phi,scale,distort,d);rect(uv,vec4(5,15,2,2),shift,phi,scale,distort,d);rect(uv,vec4(5,15,3,1),shift,phi,scale,distort,d);
}
void glyph_N(in vec2 uv, in vec2 shift, in float phi, in float scale, in float alpha, in float distort, inout float d){
rect(uv,vec4(4,1,1,5),shift,phi,scale,distort,d);rect(uv,vec4(11,1,1,5),shift,phi,scale,distort,d);rect(uv,vec4(3,2,1,10),shift,phi,scale,distort,d);rect(uv,vec4(3,3,3,3),shift,phi,scale,distort,d);rect(uv,vec4(5,3,1,6),shift,phi,scale,distort,d);rect(uv,vec4(10,3,1,6),shift,phi,scale,distort,d);rect(uv,vec4(2,5,1,9),shift,phi,scale,distort,d);rect(uv,vec4(9,5,1,7),shift,phi,scale,distort,d);rect(uv,vec4(5,6,2,3),shift,phi,scale,distort,d);rect(uv,vec4(6,6,1,7),shift,phi,scale,distort,d);rect(uv,vec4(5,8,3,1),shift,phi,scale,distort,d);rect(uv,vec4(6,8,2,5),shift,phi,scale,distort,d);rect(uv,vec4(7,8,1,7),shift,phi,scale,distort,d);rect(uv,vec4(1,10,1,8),shift,phi,scale,distort,d);rect(uv,vec4(6,10,3,3),shift,phi,scale,distort,d);rect(uv,vec4(7,10,2,5),shift,phi,scale,distort,d);rect(uv,vec4(8,10,1,7),shift,phi,scale,distort,d);rect(uv,vec4(0,13,2,5),shift,phi,scale,distort,d);rect(uv,vec4(0,16,3,1),shift,phi,scale,distort,d);
}
void glyph_V(in vec2 uv, in vec2 shift, in float phi, in float scale, in float alpha, in float distort, inout float d){
rect(uv,vec4(1,1,1,4),shift,phi,scale,distort,d);rect(uv,vec4(0,2,2,1),shift,phi,scale,distort,d);rect(uv,vec4(9,2,1,5),shift,phi,scale,distort,d);rect(uv,vec4(9,2,2,2),shift,phi,scale,distort,d);rect(uv,vec4(1,3,2,2),shift,phi,scale,distort,d);rect(uv,vec4(2,3,1,10),shift,phi,scale,distort,d);rect(uv,vec4(8,3,1,6),shift,phi,scale,distort,d);rect(uv,vec4(8,3,4,1),shift,phi,scale,distort,d);rect(uv,vec4(1,6,2,3),shift,phi,scale,distort,d);rect(uv,vec4(1,7,3,2),shift,phi,scale,distort,d);rect(uv,vec4(2,7,2,6),shift,phi,scale,distort,d);rect(uv,vec4(3,7,1,11),shift,phi,scale,distort,d);rect(uv,vec4(7,7,1,5),shift,phi,scale,distort,d);rect(uv,vec4(6,8,1,5),shift,phi,scale,distort,d);rect(uv,vec4(5,12,1,3),shift,phi,scale,distort,d);rect(uv,vec4(3,13,2,4),shift,phi,scale,distort,d);rect(uv,vec4(2,15,3,2),shift,phi,scale,distort,d);
}
void glyph_Q(in vec2 uv, in vec2 shift, in float phi, in float scale, in float alpha, in float distort, inout float d){
rect(uv,vec4(5,1,1,4),shift,phi,scale,distort,d);rect(uv,vec4(5,1,3,3),shift,phi,scale,distort,d);rect(uv,vec4(4,2,2,3),shift,phi,scale,distort,d);rect(uv,vec4(4,2,6,2),shift,phi,scale,distort,d);rect(uv,vec4(9,2,1,3),shift,phi,scale,distort,d);rect(uv,vec4(3,3,1,3),shift,phi,scale,distort,d);rect(uv,vec4(3,3,8,1),shift,phi,scale,distort,d);rect(uv,vec4(9,3,2,2),shift,phi,scale,distort,d);rect(uv,vec4(10,3,1,11),shift,phi,scale,distort,d);rect(uv,vec4(2,4,1,4),shift,phi,scale,distort,d);rect(uv,vec4(1,5,1,10),shift,phi,scale,distort,d);rect(uv,vec4(10,5,2,8),shift,phi,scale,distort,d);rect(uv,vec4(0,7,2,7),shift,phi,scale,distort,d);rect(uv,vec4(6,11,1,3),shift,phi,scale,distort,d);rect(uv,vec4(9,11,1,7),shift,phi,scale,distort,d);rect(uv,vec4(6,12,2,2),shift,phi,scale,distort,d);rect(uv,vec4(7,12,1,4),shift,phi,scale,distort,d);rect(uv,vec4(6,13,5,1),shift,phi,scale,distort,d);rect(uv,vec4(7,13,3,3),shift,phi,scale,distort,d);rect(uv,vec4(8,13,2,4),shift,phi,scale,distort,d);rect(uv,vec4(1,14,2,1),shift,phi,scale,distort,d);rect(uv,vec4(2,14,1,3),shift,phi,scale,distort,d);rect(uv,vec4(2,15,4,2),shift,phi,scale,distort,d);rect(uv,vec4(2,15,9,1),shift,phi,scale,distort,d);rect(uv,vec4(8,15,3,2),shift,phi,scale,distort,d);rect(uv,vec4(9,15,2,3),shift,phi,scale,distort,d);rect(uv,vec4(8,16,4,1),shift,phi,scale,distort,d);rect(uv,vec4(9,16,3,2),shift,phi,scale,distort,d);
}
void glyph_U(in vec2 uv, in vec2 shift, in float phi, in float scale, in float alpha, in float distort, inout float d){
rect(uv,vec4(3,2,1,4),shift,phi,scale,distort,d);rect(uv,vec4(3,2,2,1),shift,phi,scale,distort,d);rect(uv,vec4(10,2,1,12),shift,phi,scale,distort,d);rect(uv,vec4(2,3,1,13),shift,phi,scale,distort,d);rect(uv,vec4(9,4,1,13),shift,phi,scale,distort,d);rect(uv,vec4(1,6,2,8),shift,phi,scale,distort,d);rect(uv,vec4(8,9,1,9),shift,phi,scale,distort,d);rect(uv,vec4(7,13,3,2),shift,phi,scale,distort,d);rect(uv,vec4(7,13,5,1),shift,phi,scale,distort,d);rect(uv,vec4(2,14,2,2),shift,phi,scale,distort,d);rect(uv,vec4(3,14,1,3),shift,phi,scale,distort,d);rect(uv,vec4(5,14,1,3),shift,phi,scale,distort,d);rect(uv,vec4(5,14,2,2),shift,phi,scale,distort,d);rect(uv,vec4(2,15,5,1),shift,phi,scale,distort,d);rect(uv,vec4(3,15,3,2),shift,phi,scale,distort,d);
}
void glyph_E(in vec2 uv, in vec2 shift, in float phi, in float scale, in float alpha, in float distort, inout float d){
rect(uv,vec4(8,0,1,4),shift,phi,scale,distort,d);rect(uv,vec4(3,1,1,12),shift,phi,scale,distort,d);rect(uv,vec4(3,1,2,5),shift,phi,scale,distort,d);rect(uv,vec4(3,1,8,2),shift,phi,scale,distort,d);rect(uv,vec4(8,1,3,3),shift,phi,scale,distort,d);rect(uv,vec4(9,1,1,5),shift,phi,scale,distort,d);rect(uv,vec4(2,2,3,2),shift,phi,scale,distort,d);rect(uv,vec4(2,5,1,12),shift,phi,scale,distort,d);rect(uv,vec4(1,6,3,1),shift,phi,scale,distort,d);rect(uv,vec4(2,8,3,3),shift,phi,scale,distort,d);rect(uv,vec4(6,8,1,3),shift,phi,scale,distort,d);rect(uv,vec4(6,8,3,2),shift,phi,scale,distort,d);rect(uv,vec4(6,8,4,1),shift,phi,scale,distort,d);rect(uv,vec4(2,9,5,2),shift,phi,scale,distort,d);rect(uv,vec4(1,11,2,6),shift,phi,scale,distort,d);rect(uv,vec4(9,12,1,4),shift,phi,scale,distort,d);rect(uv,vec4(7,13,2,4),shift,phi,scale,distort,d);rect(uv,vec4(6,14,3,3),shift,phi,scale,distort,d);rect(uv,vec4(0,15,10,1),shift,phi,scale,distort,d);rect(uv,vec4(1,15,8,2),shift,phi,scale,distort,d);
}
        void glyph_0(in vec2 uv, in vec2 shift, in float phi, in float scale, in float alpha, in float distort, inout float d){
rect(uv,vec4(7,2,2,2),shift,phi,scale,distort,d);rect(uv,vec4(6,3,1,2),shift,phi,scale,distort,d);rect(uv,vec4(6,3,5,1),shift,phi,scale,distort,d);rect(uv,vec4(10,3,1,2),shift,phi,scale,distort,d);rect(uv,vec4(4,4,1,2),shift,phi,scale,distort,d);rect(uv,vec4(4,4,3,1),shift,phi,scale,distort,d);rect(uv,vec4(3,5,1,2),shift,phi,scale,distort,d);rect(uv,vec4(11,5,1,7),shift,phi,scale,distort,d);rect(uv,vec4(2,6,1,10),shift,phi,scale,distort,d);rect(uv,vec4(10,6,1,9),shift,phi,scale,distort,d);rect(uv,vec4(8,7,1,2),shift,phi,scale,distort,d);rect(uv,vec4(1,8,2,6),shift,phi,scale,distort,d);rect(uv,vec4(7,8,1,2),shift,phi,scale,distort,d);rect(uv,vec4(6,9,1,2),shift,phi,scale,distort,d);rect(uv,vec4(5,11,1,2),shift,phi,scale,distort,d);rect(uv,vec4(4,12,1,2),shift,phi,scale,distort,d);rect(uv,vec4(2,14,2,2),shift,phi,scale,distort,d);rect(uv,vec4(9,14,1,2),shift,phi,scale,distort,d);rect(uv,vec4(2,15,3,1),shift,phi,scale,distort,d);rect(uv,vec4(4,15,1,2),shift,phi,scale,distort,d);rect(uv,vec4(8,15,1,2),shift,phi,scale,distort,d);rect(uv,vec4(4,16,5,1),shift,phi,scale,distort,d);
}
void glyph_1(in vec2 uv, in vec2 shift, in float phi, in float scale, in float alpha, in float distort, inout float d){
rect(uv,vec4(8,1,1,3),shift,phi,scale,distort,d);rect(uv,vec4(7,2,1,16),shift,phi,scale,distort,d);rect(uv,vec4(5,3,1,3),shift,phi,scale,distort,d);rect(uv,vec4(5,3,3,2),shift,phi,scale,distort,d);rect(uv,vec4(4,4,1,3),shift,phi,scale,distort,d);rect(uv,vec4(3,5,1,3),shift,phi,scale,distort,d);rect(uv,vec4(7,6,2,3),shift,phi,scale,distort,d);rect(uv,vec4(2,7,1,2),shift,phi,scale,distort,d);rect(uv,vec4(6,7,2,9),shift,phi,scale,distort,d);rect(uv,vec4(7,16,2,2),shift,phi,scale,distort,d);
}
void glyph_2(in vec2 uv, in vec2 shift, in float phi, in float scale, in float alpha, in float distort, inout float d){
rect(uv,vec4(4,1,3,2),shift,phi,scale,distort,d);rect(uv,vec4(3,2,1,2),shift,phi,scale,distort,d);rect(uv,vec4(3,2,5,1),shift,phi,scale,distort,d);rect(uv,vec4(7,2,1,2),shift,phi,scale,distort,d);rect(uv,vec4(2,3,1,2),shift,phi,scale,distort,d);rect(uv,vec4(7,3,2,1),shift,phi,scale,distort,d);rect(uv,vec4(8,3,1,9),shift,phi,scale,distort,d);rect(uv,vec4(1,4,1,4),shift,phi,scale,distort,d);rect(uv,vec4(8,4,2,6),shift,phi,scale,distort,d);rect(uv,vec4(7,9,1,4),shift,phi,scale,distort,d);rect(uv,vec4(6,11,1,5),shift,phi,scale,distort,d);rect(uv,vec4(4,13,3,3),shift,phi,scale,distort,d);rect(uv,vec4(10,13,1,4),shift,phi,scale,distort,d);rect(uv,vec4(2,14,2,3),shift,phi,scale,distort,d);rect(uv,vec4(2,14,10,2),shift,phi,scale,distort,d);rect(uv,vec4(9,14,2,3),shift,phi,scale,distort,d);rect(uv,vec4(0,15,12,1),shift,phi,scale,distort,d);rect(uv,vec4(1,15,3,2),shift,phi,scale,distort,d);
}
void glyph_5(in vec2 uv, in vec2 shift, in float phi, in float scale, in float alpha, in float distort, inout float d){
rect(uv,vec4(8,1,2,2),shift,phi,scale,distort,d);rect(uv,vec4(8,1,3,1),shift,phi,scale,distort,d);rect(uv,vec4(1,2,9,1),shift,phi,scale,distort,d);rect(uv,vec4(2,2,1,10),shift,phi,scale,distort,d);rect(uv,vec4(2,2,2,9),shift,phi,scale,distort,d);rect(uv,vec4(2,2,6,2),shift,phi,scale,distort,d);rect(uv,vec4(2,8,6,2),shift,phi,scale,distort,d);rect(uv,vec4(7,8,1,3),shift,phi,scale,distort,d);rect(uv,vec4(1,9,3,2),shift,phi,scale,distort,d);rect(uv,vec4(1,9,9,1),shift,phi,scale,distort,d);rect(uv,vec4(7,9,3,2),shift,phi,scale,distort,d);rect(uv,vec4(9,9,1,8),shift,phi,scale,distort,d);rect(uv,vec4(7,10,4,1),shift,phi,scale,distort,d);rect(uv,vec4(9,10,2,5),shift,phi,scale,distort,d);rect(uv,vec4(8,14,1,4),shift,phi,scale,distort,d);rect(uv,vec4(1,15,3,1),shift,phi,scale,distort,d);rect(uv,vec4(2,15,2,2),shift,phi,scale,distort,d);rect(uv,vec4(7,15,2,3),shift,phi,scale,distort,d);rect(uv,vec4(2,16,8,1),shift,phi,scale,distort,d);rect(uv,vec4(4,16,5,2),shift,phi,scale,distort,d);
}
void glyph_A(in vec2 uv, in vec2 shift, in float phi, in float scale, in float alpha, in float distort, inout float d){
rect(uv,vec4(7,1,1,5),shift,phi,scale,distort,d);rect(uv,vec4(6,2,1,6),shift,phi,scale,distort,d);rect(uv,vec4(6,3,3,3),shift,phi,scale,distort,d);rect(uv,vec4(8,3,1,15),shift,phi,scale,distort,d);rect(uv,vec4(5,5,1,7),shift,phi,scale,distort,d);rect(uv,vec4(8,6,2,12),shift,phi,scale,distort,d);rect(uv,vec4(4,7,1,6),shift,phi,scale,distort,d);rect(uv,vec4(2,9,4,1),shift,phi,scale,distort,d);rect(uv,vec4(3,9,3,2),shift,phi,scale,distort,d);rect(uv,vec4(3,10,7,1),shift,phi,scale,distort,d);rect(uv,vec4(4,10,6,2),shift,phi,scale,distort,d);rect(uv,vec4(7,10,3,3),shift,phi,scale,distort,d);rect(uv,vec4(4,11,7,1),shift,phi,scale,distort,d);rect(uv,vec4(7,11,4,2),shift,phi,scale,distort,d);rect(uv,vec4(2,12,1,4),shift,phi,scale,distort,d);rect(uv,vec4(2,12,2,2),shift,phi,scale,distort,d);rect(uv,vec4(8,14,3,3),shift,phi,scale,distort,d);rect(uv,vec4(1,15,1,3),shift,phi,scale,distort,d);
}
void glyph_u(in vec2 uv, in vec2 shift, in float phi, in float scale, in float alpha, in float distort, inout float d){
rect(uv,vec4(1,6,1,7),shift,phi,scale,distort,d);rect(uv,vec4(8,6,1,8),shift,phi,scale,distort,d);rect(uv,vec4(7,7,1,8),shift,phi,scale,distort,d);rect(uv,vec4(1,8,2,5),shift,phi,scale,distort,d);rect(uv,vec4(2,8,1,6),shift,phi,scale,distort,d);rect(uv,vec4(1,12,3,1),shift,phi,scale,distort,d);rect(uv,vec4(2,12,2,2),shift,phi,scale,distort,d);rect(uv,vec4(3,12,1,3),shift,phi,scale,distort,d);rect(uv,vec4(7,12,3,2),shift,phi,scale,distort,d);rect(uv,vec4(9,12,1,3),shift,phi,scale,distort,d);rect(uv,vec4(2,13,8,1),shift,phi,scale,distort,d);rect(uv,vec4(3,13,5,2),shift,phi,scale,distort,d);
}
void glyph_g(in vec2 uv, in vec2 shift, in float phi, in float scale, in float alpha, in float distort, inout float d){
rect(uv,vec4(10,5,1,7),shift,phi,scale,distort,d);rect(uv,vec4(6,6,3,2),shift,phi,scale,distort,d);rect(uv,vec4(5,7,1,2),shift,phi,scale,distort,d);rect(uv,vec4(5,7,6,1),shift,phi,scale,distort,d);rect(uv,vec4(4,8,1,4),shift,phi,scale,distort,d);rect(uv,vec4(10,8,2,2),shift,phi,scale,distort,d);rect(uv,vec4(9,9,1,5),shift,phi,scale,distort,d);rect(uv,vec4(3,10,2,2),shift,phi,scale,distort,d);rect(uv,vec4(7,10,1,2),shift,phi,scale,distort,d);rect(uv,vec4(3,11,5,1),shift,phi,scale,distort,d);rect(uv,vec4(5,11,2,2),shift,phi,scale,distort,d);rect(uv,vec4(8,13,1,3),shift,phi,scale,distort,d);rect(uv,vec4(2,14,1,2),shift,phi,scale,distort,d);rect(uv,vec4(2,15,4,1),shift,phi,scale,distort,d);rect(uv,vec4(3,15,3,2),shift,phi,scale,distort,d);rect(uv,vec4(7,15,1,2),shift,phi,scale,distort,d);rect(uv,vec4(3,16,5,1),shift,phi,scale,distort,d);
}
void glyph_s(in vec2 uv, in vec2 shift, in float phi, in float scale, in float alpha, in float distort, inout float d){
rect(uv,vec4(4,6,1,4),shift,phi,scale,distort,d);rect(uv,vec4(4,6,5,1),shift,phi,scale,distort,d);rect(uv,vec4(3,7,2,2),shift,phi,scale,distort,d);rect(uv,vec4(4,9,2,1),shift,phi,scale,distort,d);rect(uv,vec4(5,9,1,2),shift,phi,scale,distort,d);rect(uv,vec4(5,10,3,1),shift,phi,scale,distort,d);rect(uv,vec4(7,10,1,5),shift,phi,scale,distort,d);rect(uv,vec4(7,11,2,3),shift,phi,scale,distort,d);rect(uv,vec4(1,13,1,2),shift,phi,scale,distort,d);rect(uv,vec4(6,13,2,2),shift,phi,scale,distort,d);rect(uv,vec4(1,14,7,1),shift,phi,scale,distort,d);rect(uv,vec4(3,14,3,2),shift,phi,scale,distort,d);rect(uv,vec4(9,7,1,1),shift,phi,scale,distort,d);
}
void glyph_t(in vec2 uv, in vec2 shift, in float phi, in float scale, in float alpha, in float distort, inout float d){
rect(uv,vec4(5,2,1,9),shift,phi,scale,distort,d);rect(uv,vec4(3,5,5,2),shift,phi,scale,distort,d);rect(uv,vec4(3,5,6,1),shift,phi,scale,distort,d);rect(uv,vec4(4,5,1,9),shift,phi,scale,distort,d);rect(uv,vec4(1,6,7,1),shift,phi,scale,distort,d);rect(uv,vec4(3,10,1,6),shift,phi,scale,distort,d);
}

void glyph_h(in vec2 uv, in vec2 shift, in float phi, in float scale, in float alpha, in float distort, inout float d){
rect(uv,vec4(2,3,1,5),shift,phi,scale,distort,d);rect(uv,vec4(2,5,2,3),shift,phi,scale,distort,d);rect(uv,vec4(3,5,1,9),shift,phi,scale,distort,d);rect(uv,vec4(2,7,3,1),shift,phi,scale,distort,d);rect(uv,vec4(3,7,2,4),shift,phi,scale,distort,d);rect(uv,vec4(3,9,5,1),shift,phi,scale,distort,d);rect(uv,vec4(7,9,1,2),shift,phi,scale,distort,d);rect(uv,vec4(2,10,1,6),shift,phi,scale,distort,d);rect(uv,vec4(7,10,2,1),shift,phi,scale,distort,d);rect(uv,vec4(8,10,1,6),shift,phi,scale,distort,d);rect(uv,vec4(8,11,2,4),shift,phi,scale,distort,d);rect(uv,vec4(1,12,3,1),shift,phi,scale,distort,d);
}
void glyph_O(in vec2 uv, in vec2 shift, in float phi, in float scale, in float alpha, in float distort, inout float d){
rect(uv,vec4(4,2,1,3),shift,phi,scale,distort,d);rect(uv,vec4(4,2,2,2),shift,phi,scale,distort,d);rect(uv,vec4(4,2,4,1),shift,phi,scale,distort,d);rect(uv,vec4(7,2,1,2),shift,phi,scale,distort,d);rect(uv,vec4(3,3,1,3),shift,phi,scale,distort,d);rect(uv,vec4(7,3,2,1),shift,phi,scale,distort,d);rect(uv,vec4(2,5,1,4),shift,phi,scale,distort,d);rect(uv,vec4(10,5,1,2),shift,phi,scale,distort,d);rect(uv,vec4(1,6,1,8),shift,phi,scale,distort,d);rect(uv,vec4(11,7,1,5),shift,phi,scale,distort,d);rect(uv,vec4(0,9,2,3),shift,phi,scale,distort,d);rect(uv,vec4(0,11,3,1),shift,phi,scale,distort,d);rect(uv,vec4(1,11,2,3),shift,phi,scale,distort,d);rect(uv,vec4(2,11,1,5),shift,phi,scale,distort,d);rect(uv,vec4(10,11,1,3),shift,phi,scale,distort,d);rect(uv,vec4(1,13,3,1),shift,phi,scale,distort,d);rect(uv,vec4(2,13,2,3),shift,phi,scale,distort,d);rect(uv,vec4(3,13,1,4),shift,phi,scale,distort,d);rect(uv,vec4(9,13,1,3),shift,phi,scale,distort,d);rect(uv,vec4(2,14,3,2),shift,phi,scale,distort,d);rect(uv,vec4(3,14,2,3),shift,phi,scale,distort,d);rect(uv,vec4(8,14,2,2),shift,phi,scale,distort,d);rect(uv,vec4(2,15,8,1),shift,phi,scale,distort,d);rect(uv,vec4(3,15,5,2),shift,phi,scale,distort,d);rect(uv,vec4(9,4,1,1),shift,phi,scale,distort,d);
}
void glyph_n(in vec2 uv, in vec2 shift, in float phi, in float scale, in float alpha, in float distort, inout float d){
rect(uv,vec4(2,6,1,7),shift,phi,scale,distort,d);rect(uv,vec4(5,6,3,2),shift,phi,scale,distort,d);rect(uv,vec4(1,7,1,8),shift,phi,scale,distort,d);rect(uv,vec4(4,7,1,2),shift,phi,scale,distort,d);rect(uv,vec4(4,7,6,1),shift,phi,scale,distort,d);rect(uv,vec4(8,7,2,3),shift,phi,scale,distort,d);rect(uv,vec4(9,7,1,7),shift,phi,scale,distort,d);rect(uv,vec4(1,8,4,1),shift,phi,scale,distort,d);rect(uv,vec4(8,9,3,1),shift,phi,scale,distort,d);rect(uv,vec4(9,9,2,3),shift,phi,scale,distort,d);rect(uv,vec4(8,11,1,5),shift,phi,scale,distort,d);rect(uv,vec4(0,12,1,4),shift,phi,scale,distort,d);
}
void glyph_l(in vec2 uv, in vec2 shift, in float phi, in float scale, in float alpha, in float distort, inout float d){
rect(uv,vec4(7,2,1,2),shift,phi,scale,distort,d);rect(uv,vec4(6,3,1,5),shift,phi,scale,distort,d);rect(uv,vec4(5,5,1,7),shift,phi,scale,distort,d);rect(uv,vec4(4,8,1,9),shift,phi,scale,distort,d);rect(uv,vec4(3,11,2,5),shift,phi,scale,distort,d);rect(uv,vec4(7,14,1,3),shift,phi,scale,distort,d);rect(uv,vec4(7,14,2,2),shift,phi,scale,distort,d);rect(uv,vec4(7,14,3,1),shift,phi,scale,distort,d);rect(uv,vec4(3,15,6,1),shift,phi,scale,distort,d);rect(uv,vec4(4,15,4,2),shift,phi,scale,distort,d);
}
void glyph_i(in vec2 uv, in vec2 shift, in float phi, in float scale, in float alpha, in float distort, inout float d){
rect(uv,vec4(3,4,1,3),shift,phi,scale,distort,d);rect(uv,vec4(2,5,2,2),shift,phi,scale,distort,d);rect(uv,vec4(2,9,1,7),shift,phi,scale,distort,d);rect(uv,vec4(1,10,2,6),shift,phi,scale,distort,d);rect(uv,vec4(1,11,3,3),shift,phi,scale,distort,d);
}
void glyph_e(in vec2 uv, in vec2 shift, in float phi, in float scale, in float alpha, in float distort, inout float d){
rect(uv,vec4(5,5,1,2),shift,phi,scale,distort,d);rect(uv,vec4(5,5,3,1),shift,phi,scale,distort,d);rect(uv,vec4(7,5,1,4),shift,phi,scale,distort,d);rect(uv,vec4(3,6,1,5),shift,phi,scale,distort,d);rect(uv,vec4(3,6,3,1),shift,phi,scale,distort,d);rect(uv,vec4(7,6,2,3),shift,phi,scale,distort,d);rect(uv,vec4(2,8,1,6),shift,phi,scale,distort,d);rect(uv,vec4(5,8,2,2),shift,phi,scale,distort,d);rect(uv,vec4(2,9,3,2),shift,phi,scale,distort,d);rect(uv,vec4(1,10,2,3),shift,phi,scale,distort,d);rect(uv,vec4(9,11,1,2),shift,phi,scale,distort,d);rect(uv,vec4(7,12,1,3),shift,phi,scale,distort,d);rect(uv,vec4(7,12,2,2),shift,phi,scale,distort,d);rect(uv,vec4(2,13,2,1),shift,phi,scale,distort,d);rect(uv,vec4(3,13,1,2),shift,phi,scale,distort,d);rect(uv,vec4(5,13,3,2),shift,phi,scale,distort,d);rect(uv,vec4(3,14,5,1),shift,phi,scale,distort,d);
}
void glyph_eggsclamation(in vec2 uv, in vec2 shift, in float phi, in float scale, in float alpha, in float distort, inout float d){
rect(uv,vec4(1,0,1,10),shift,phi,scale,distort,d);rect(uv,vec4(3,0,1,5),shift,phi,scale,distort,d);rect(uv,vec4(3,0,2,1),shift,phi,scale,distort,d);rect(uv,vec4(1,1,2,9),shift,phi,scale,distort,d);rect(uv,vec4(1,6,3,2),shift,phi,scale,distort,d);rect(uv,vec4(2,12,1,3),shift,phi,scale,distort,d);rect(uv,vec4(2,12,2,2),shift,phi,scale,distort,d);rect(uv,vec4(1,13,2,2),shift,phi,scale,distort,d);
}
    void phrase_dotdotdotnolelzeichenevokequestschn(in vec2 uv, in vec2 shift, in float phi, in float scale, in float alpha, in float blur, in float distort, in float spac, inout vec3 col)
            {
                float d = 1.;
                glyph_dot(uv,shift+vec2(-57.*spac,-9.),phi,scale,alpha,distort,d);
        glyph_dot(uv,shift+vec2(-52.*spac,-9.),phi,scale,alpha,distort,d);
        glyph_dot(uv,shift+vec2(-47.*spac,-9.),phi,scale,alpha,distort,d);
        glyph_n(uv,shift+vec2(-41.*spac,-9.),phi,scale,alpha,distort,d);
        glyph_o(uv,shift+vec2(-29.*spac,-9.),phi,scale,alpha,distort,d);
        glyph_lelzeichen(uv,shift+vec2(-17.*spac,-9.),phi,scale,alpha,distort,d);
        glyph_e(uv,shift+vec2(-9.*spac,-9.),phi,scale,alpha,distort,d);
        glyph_v(uv,shift+vec2(1.*spac,-9.),phi,scale,alpha,distort,d);
        glyph_o(uv,shift+vec2(13.*spac,-9.),phi,scale,alpha,distort,d);
        glyph_k(uv,shift+vec2(25.*spac,-9.),phi,scale,alpha,distort,d);
        glyph_e(uv,shift+vec2(35.*spac,-8.),phi,scale,alpha,distort,d);
        glyph_questschn(uv,shift+vec2(45.*spac,-9.),phi,scale,alpha,distort,d);
                col = mix(col, c.yyy, alpha * sm(d, blur));
            }void phrase_NOVOQUE(in vec2 uv, in vec2 shift, in float phi, in float scale, in float alpha, in float blur, in float distort, in float spac, inout vec3 col)
            {
                float d = 1.;
                glyph_N(uv,shift+vec2(-42.*spac,-9.),phi,scale,alpha,distort,d);
        glyph_O(uv,shift+vec2(-30.*spac,-9.),phi,scale,alpha,distort,d);
        glyph_V(uv,shift+vec2(-18.*spac,-9.),phi,scale,alpha,distort,d);
        glyph_O(uv,shift+vec2(-7.*spac,-10.),phi,scale,alpha,distort,d);
        glyph_Q(uv,shift+vec2(6.*spac,-9.),phi,scale,alpha,distort,d);
        glyph_U(uv,shift+vec2(18.*spac,-9.),phi,scale,alpha,distort,d);
        glyph_E(uv,shift+vec2(30.*spac,-9.),phi,scale,alpha,distort,d);
                col = mix(col, c.yyy, alpha * sm(d, blur));
            }void phrase_nolelzeichenevokedot(in vec2 uv, in vec2 shift, in float phi, in float scale, in float alpha, in float blur, in float distort, in float spac, inout vec3 col)
            {
                float d = 1.;
                glyph_n(uv,shift+vec2(-46.*spac,-9.),phi,scale,alpha,distort,d);
        glyph_o(uv,shift+vec2(-34.*spac,-9.),phi,scale,alpha,distort,d);
        glyph_lelzeichen(uv,shift+vec2(-22.*spac,-9.),phi,scale,alpha,distort,d);
        glyph_e(uv,shift+vec2(-14.*spac,-9.),phi,scale,alpha,distort,d);
        glyph_v(uv,shift+vec2(-4.*spac,-9.),phi,scale,alpha,distort,d);
        glyph_o(uv,shift+vec2(8.*spac,-9.),phi,scale,alpha,distort,d);
        glyph_k(uv,shift+vec2(20.*spac,-9.),phi,scale,alpha,distort,d);
        glyph_e(uv,shift+vec2(30.*spac,-8.),phi,scale,alpha,distort,d);
        glyph_dot(uv,shift+vec2(40.*spac,-9.),phi,scale,alpha,distort,d);
                col = mix(col, c.yyy, alpha * sm(d, blur));
            }
    void phrase_Augustlelzeichen15th(in vec2 uv, in vec2 shift, in float phi, in float scale, in float alpha, in float blur, in float distort, in float spac, inout vec3 col)
            {
                float d = 1.;
                glyph_A(uv,shift+vec2(-55.5*spac,-9.),phi,scale,alpha,distort,d);
        glyph_u(uv,shift+vec2(-44.5*spac,-9.),phi,scale,alpha,distort,d);
        glyph_g(uv,shift+vec2(-36.5*spac,-8.),phi,scale,alpha,distort,d);
        glyph_u(uv,shift+vec2(-24.5*spac,-9.),phi,scale,alpha,distort,d);
        glyph_s(uv,shift+vec2(-14.5*spac,-9.),phi,scale,alpha,distort,d);
        glyph_t(uv,shift+vec2(-4.5*spac,-9.),phi,scale,alpha,distort,d);
        glyph_lelzeichen(uv,shift+vec2(4.5*spac,-9.),phi,scale,alpha,distort,d);
        glyph_1(uv,shift+vec2(12.5*spac,-9.),phi,scale,alpha,distort,d);
        glyph_5(uv,shift+vec2(24.5*spac,-9.),phi,scale,alpha,distort,d);
        glyph_t(uv,shift+vec2(36.5*spac,-9.),phi,scale,alpha,distort,d);
        glyph_h(uv,shift+vec2(44.5*spac,-10.),phi,scale,alpha,distort,d);
                col = mix(col, c.yyy, alpha * sm(d, blur));
            }void phrase_2020(in vec2 uv, in vec2 shift, in float phi, in float scale, in float alpha, in float blur, in float distort, in float spac, inout vec3 col)
            {
                float d = 1.;
                glyph_2(uv,shift+vec2(-24.*spac,-9.),phi,scale,alpha,distort,d);
        glyph_0(uv,shift+vec2(-12.*spac,-9.),phi,scale,alpha,distort,d);
        glyph_2(uv,shift+vec2(0.*spac,-9.),phi,scale,alpha,distort,d);
        glyph_0(uv,shift+vec2(12.*spac,-9.),phi,scale,alpha,distort,d);
                col = mix(col, c.yyy, alpha * sm(d, blur));
            }    void phrase_Onlineeggsclamation(in vec2 uv, in vec2 shift, in float phi, in float scale, in float alpha, in float blur, in float distort, in float spac, inout vec3 col)
            {
                float d = 1.;
                glyph_O(uv,shift+vec2(-33.*spac,-9.),phi,scale,alpha,distort,d);
        glyph_n(uv,shift+vec2(-20.*spac,-9.),phi,scale,alpha,distort,d);
        glyph_l(uv,shift+vec2(-11.*spac,-8.),phi,scale,alpha,distort,d);
        glyph_i(uv,shift+vec2(-1.*spac,-9.),phi,scale,alpha,distort,d);
        glyph_n(uv,shift+vec2(4.*spac,-9.),phi,scale,alpha,distort,d);
        glyph_e(uv,shift+vec2(16.*spac,-9.),phi,scale,alpha,distort,d);
        glyph_eggsclamation(uv,shift+vec2(26.*spac,-9.),phi,scale,alpha,distort,d);
                col = mix(col, c.yyy, alpha * sm(d, blur));
            }
float bpm = 148.797; //162.00

    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
        fragColor = texture(iChannel0, fragCoord.xy/iResolution.xy);
    }    

void main()
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
