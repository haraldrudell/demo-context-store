// openfile.js
// Wait 10 s so that we can do lsof on a node process
// © Harald Rudell 2013 MIT License

console.log(process.pid)
setTimeout(f, 1e7)
function f() {}

/*
Open files:
cwd: current working directory
rtd: root folder
txt: node executable
8 mem: /lib, /usr/lib stdio libraries
0u: can be r /dev/null stdin /dev/pts7
1u 2u: /dev/pts7
3u, 4u anon_inode for the two pipes
5r, 6w: pipe read-write signal to signalSender

FD field: name or number of the in-process file decriptor

cloud1:express3webfiller has additionally
2 socket: stdout stderr
/dev/null: stdio
leaked nogodmaster.log
webfiller index.css
webfiller index.js

foxyboy@c505:~/log$ date; ~/lsof -w +c 15 -p 15425
Fri Jan 18 09:10:32 PST 2013
COMMAND   PID    USER   FD   TYPE DEVICE SIZE/OFF     NODE NAME
node    15425 foxyboy  cwd    DIR   8,97     4096  2351302 /home/foxyboy/Desktop/c505/node/nodejs3
node    15425 foxyboy  rtd    DIR    8,2     4096        2 /
node    15425 foxyboy  txt    REG    8,2 10548377   467077 /usr/local/bin/node
node    15425 foxyboy  mem    REG    8,2  1811160  2162847 /lib/x86_64-linux-gnu/libc-2.15.so
node    15425 foxyboy  mem    REG    8,2   135398  2162849 /lib/x86_64-linux-gnu/libpthread-2.15.so
node    15425 foxyboy  mem    REG    8,2    88400  2048055 /lib/x86_64-linux-gnu/libgcc_s.so.1
node    15425 foxyboy  mem    REG    8,2  1030536  2162855 /lib/x86_64-linux-gnu/libm-2.15.so
node    15425 foxyboy  mem    REG    8,2   975216   607712 /usr/lib/x86_64-linux-gnu/libstdc++.so.6.0.17
node    15425 foxyboy  mem    REG    8,2    31784  2162851 /lib/x86_64-linux-gnu/librt-2.15.so
node    15425 foxyboy  mem    REG    8,2    14792  2162846 /lib/x86_64-linux-gnu/libdl-2.15.so
node    15425 foxyboy  mem    REG    8,2   149312  2162861 /lib/x86_64-linux-gnu/ld-2.15.so
node    15425 foxyboy    0u   CHR  136,7      0t0       10 /dev/pts/7
node    15425 foxyboy    1u   CHR  136,7      0t0       10 /dev/pts/7
node    15425 foxyboy    2u   CHR  136,7      0t0       10 /dev/pts/7
node    15425 foxyboy    3u  0000    0,9        0     6897 anon_inode
node    15425 foxyboy    4u  0000    0,9        0     6897 anon_inode
node    15425 foxyboy    5r  FIFO    0,8      0t0 54298162 pipe
node    15425 foxyboy    6w  FIFO    0,8      0t0 54298162 pipe
*/