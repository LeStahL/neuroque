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

uniform float iFSAA;
uniform vec2 iResolution;
uniform sampler2D iChannel0;
uniform float iTime;

out vec4 gl_FragColor;

const vec3 c = vec3(1.,0.,-1.);
const float pi = acos(-1.);

float iScale, nBeats;
void scale(in float time, out float s);
void nbeats(in float time, out float n);;

void rand(in vec2 x, out float n)
{
    x += 400.;
    n = fract(sin(dot(sign(x)*abs(x) ,vec2(12.9898,78.233)))*43758.5453);
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

void mfnoise(in vec2 x, in float d, in float b, in float e, out float n)
{
    n = 0.;
    float a = 1., nf = 0., buf;
    for(float f = d; f<b; f *= 2.)
    {
        lfnoise(f*x, buf);
        n += a*buf;
        a *= e;
        nf += 1.;
    }
    n *= (1.-e)/(1.-pow(e, nf));
}

void cnoise(in float x, out float n)
{
    float x1 = floor(x), 
        x2 = ceil(x),
        h1, h2;
    rand(x1*c.xx, h1);
    rand(x2*c.xx, h2);
    x = fract(x);
    
    float a = .5*(1.-abs(h1-h2)/sqrt(3.));
    n = clamp(sqrt(3.)*mix(1.-x,x,step(h1,h2))+.5*(h1+h2-sqrt(3.)), min(h1,h2), max(h1,h2));
}

void dlinesegment(in vec2 x, in vec2 p1, in vec2 p2, out float d)
{
    vec2 da = p2-p1;
    d = length(x-mix(p1, p2, clamp(dot(x-p1, da)/dot(da,da),0.,1.)));
}

float sm(in float d)
{
    return smoothstep(1.5/iResolution.y, -1.5/iResolution.y, d);
}

// Extrusion
void zextrude(in float z, in float d2d, in float h, out float d)
{
    vec2 w = vec2(d2d, abs(z)-0.5*h);
    d = min(max(w.x,w.y),0.0) + length(max(w,0.0));
}

// iq's smooth minimum
void smoothmin(in float a, in float b, in float k, out float dst)
{
    float h = max( k-abs(a-b), 0.0 )/k;
    dst = min( a, b ) - h*h*h*k*(1.0/6.0);
}

void main()
{
    vec2 uv = (gl_FragCoord.xy -.5*iResolution.xy)/iResolution.y;
    vec3 col = c.yyy;

    vec3 c2 =  texture(iChannel0, gl_FragCoord.xy/iResolution.xy).rgb;

    col = c2;
    
    // Add stripes
    col = mix(col, mix(col,c.yyy,.7), sm(abs(uv.y-.45)-.04));
    
    // grid lines
    vec2 y = mod(uv, .025)-.0125;
    y = abs(y);
    float rr;
    lfnoise(uv-mod(uv, .025)-iTime, rr);
    col = mix(col, mix(c.xxx,c.yyy, sm(min(y.x,y.y))),.1*rr);
    
    // Scan lines
    col += vec3(0., 0.05, 0.1)*sin(uv.y*1050.+ 5.*iTime);
    
    scale(iTime,iScale);
    col += .3*col*iScale*step(35.8321,iTime);
    
    gl_FragColor = vec4(clamp(col, 0.,1.), 1.);
}
