#version 130
void scale(in float iTime, out float s)
{
    if(iTime >=  0.0  && iTime <  25.7143 )
    {
        s = mod(iTime+.3- 0.0 , 0.535675 )- 0.2678375 ;
        s = smoothstep( -0.04463958333333334 ,0.,s)*(1.-smoothstep(0., 0.13391875 ,s));
    }
    if(iTime >=  25.7143  && iTime <  30.2426 )
    {
        s = mod(iTime+.3- 25.7143 , 0.566 )- 0.283 ;
        s = smoothstep( -0.04716666666666666 ,0.,s)*(1.-smoothstep(0., 0.1415 ,s));
    }
    if(iTime >=  30.2426  && iTime <  35.0426 )
    {
        s = mod(iTime+.3- 30.2426 , 0.59995 )- 0.299975 ;
        s = smoothstep( -0.04999583333333333 ,0.,s)*(1.-smoothstep(0., 0.1499875 ,s));
    }
    if(iTime >=  35.0426  && iTime <  35.8321 )
    {
        s = mod(iTime+.3- 35.0426 , 0.197375 )- 0.0986875 ;
        s = smoothstep( -0.016447916666666666 ,0.,s)*(1.-smoothstep(0., 0.04934375 ,s));
    }
    if(iTime >=  35.8321  && iTime <  100.1178 )
    {
        s = mod(iTime+.3- 35.8321 , 0.35715 )- 0.178575 ;
        s = smoothstep( -0.0297625 ,0.,s)*(1.-smoothstep(0., 0.0892875 ,s));
        s *= (1.-smoothstep(92.9749, 94.9749, iTime));
    }
}

