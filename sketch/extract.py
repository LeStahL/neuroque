# Hardcyber - PC-64k-Intro by Team210 at Deadline 2k19
# Copyright (C) 2019  Alexander Kraus <nr4@z10.info>
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.

from svgpathtools import Path, Line
from svgpathtools import parse_path

path_string = 'M -10.583304,127.66667 V 122.375 m -95.249996,10.58333 v -5.29166 m 74.08333,15.875 v -26.45834 l 5.291667,-5.29166 H 5.2916957 l 5.2916673,5.29166 v 10.58334 l -5.2916673,5.29166 5.2916673,5.29167 v 5.29167 l -5.2916673,5.29166 H -26.458303 Z m -95.25,-26.45834 5.29167,-5.29166 h 31.749995 l 5.291666,5.29166 V 154.125 l -5.291666,5.29167 h -10.583335 l -5.29166,-5.29167 v -5.29167 h -15.875 l -5.29167,-5.29166 z m -26.45833,15.875 v -5.29166 m -15.875,21.16666 -5.29167,-5.29166 v -26.45834 l 5.29167,-5.29166 h 31.75 l 5.29166,5.29166 v 26.45834 l -5.29166,5.29166 z m -31.75,-31.75 v 5.29167 m -21.16667,-5.29167 5.29167,-5.29166 h 10.58333 l 5.29167,5.29166 5.29166,-5.29166 h 10.58334 l 5.29166,5.29166 V 138.25 l -10.58333,10.58333 h -21.16667 L -222.24997,138.25 Z m -26.45833,10.58334 v 5.29166 m -21.16667,10.58334 v -26.45834 l 5.29167,-5.29166 h 31.75 l 5.29166,5.29166 v 26.45834 l -5.29166,5.29166 h -31.75 z m -42.33333,5.29166 -5.29167,-5.29166 v -26.45834 l 5.29167,-5.29166 h 10.58333 l 5.29167,5.29166 v -5.29166 h 15.875 l 5.29166,5.29166 v 26.45834 l -5.29166,5.29166 h -10.58334 l -5.29166,-5.29166 v 5.29166 z m 254.000001,-31.74999 v 13.22916 m -21.166671,-13.22917 5.29167,-5.29166 h 10.583333 l 5.29167,5.29166 5.29166,-5.29166 h 10.58334 l 5.29166,5.29166 v 26.45834 l -5.29166,5.29167 H -74.0833 l -5.29166,-5.29167 z'

path = parse_path(path_string)

# find dimensions
xmax = -1.e9
xmin = 1.e9
ymax = -1.e9
ymin = 1.e9
for line in path:
    xmax = max(xmax, line.start.real)
    xmax = max(xmax, line.end.real)
    
    xmin = min(xmin, line.start.real)
    xmin = min(xmin, line.end.real)
    
    ymax = max(ymax, line.start.imag)
    ymax = max(ymax, line.end.imag)
    
    ymin = min(ymin, line.start.imag)
    ymin = min(ymin, line.end.imag)

# rescale path
for i in range(len(path)):
    path[i].start -= complex(xmin,ymin)
    path[i].start = complex(path[i].start.real/abs(xmax-xmin), path[i].start.imag/abs(ymax-ymin)/100.*29.)
    path[i].start -= complex(.5,.5*29./100.)
    path[i].start = complex(path[i].start.real,-path[i].start.imag)
    
    path[i].end -= complex(xmin,ymin)
    path[i].end = complex(path[i].end.real/abs(xmax-xmin), path[i].end.imag/abs(ymax-ymin)/100.*29.)
    path[i].end -= complex(.5,.5*29./100.)
    path[i].end = complex(path[i].end.real,-path[i].end.imag)

# sort path
#newpath = [ path[0] ]
#del path[0]
#while len(path) > 1:
    #print(len(path))
    #for j in range(len(path)-1):
        #print(j,"/",len(path))
        #if abs(newpath[-1].end - path[j].start)<5.e-1:
            #newpath += [ path[j] ]
            #del path[j]
            #break
#path = newpath
    
with open('novoque-zero.frag', 'wt') as f:
    f.write('const int npts = ' + str(4*len(path)) + ';\n')
    f.write('const float path[npts] = float[npts](')
    
    for i in range(len(path)-1):
        line = path[i]
        f.write('{:.3f}'.format(line.start.real) + ',' + '{:.3f}'.format(line.start.imag) + ',')
        f.write('{:.3f}'.format(line.end.real) + ',' + '{:.3f}'.format(line.end.imag) + ',')
    line = path[-1]
    f.write('{:.3f}'.format(line.start.real) + ',' + '{:.3f}'.format(line.start.imag) + ',')
    f.write('{:.3f}'.format(line.end.real) + ',' + '{:.3f}'.format(line.end.imag))
    f.write(');\n')
    f.close()
