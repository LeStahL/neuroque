#version 130
void nbeats(in float iTime, out float s)
{
    if(iTime >=  0.0  && iTime <  25.7143 )
    {
        s = round((iTime- 0.0 )/ 0.535675 );
    }
    if(iTime >=  25.7143  && iTime <  30.2426 )
    {
        s = round((iTime- 25.7143 )/ 0.566 );
    }
    if(iTime >=  30.2426  && iTime <  35.0426 )
    {
        s = round((iTime- 30.2426 )/ 0.59995 );
    }
    if(iTime >=  35.0426  && iTime <  35.8321 )
    {
        s = round((iTime- 35.0426 )/ 0.197375 );
    }
    if(iTime >=  35.8321  && iTime <  100.1178 )
    {
        s = round((iTime- 35.8321 )/ 0.35715 );
    }
}
