import sys, scipy, matplotlib, numpy, scipy.signal, matplotlib.pyplot, struct

print("Loading.")
content = None
with open("build/Release/INTENSITY", "rt") as f:
    content = f.readlines()
    f.close()

data = []
for line in content:
    data += [ float(line) ]

print("Filtering.")
# window = 5
# filtered = scipy.signal.savgol_filter(data[:100], window, 3)
analytic_signal = scipy.signal.hilbert(data)
filtered = numpy.abs(analytic_signal)

print("Plotting.")
figure = matplotlib.pyplot.figure()
matplotlib.pyplot.plot(range(len(data)), data, 'r-')
matplotlib.pyplot.plot(range(len(filtered)), filtered, 'g-')
figure.show()

for i in range(len(filtered)):
    filtered[i] = (filtered[i]-.1)/.1

print("Saving.")
with open("build/Release/INTENSITY." + str(window), "wb") as f:
    f.write(struct.pack('d'*len(filtered), *filtered))
    f.close()
x
print("Done.")
input()