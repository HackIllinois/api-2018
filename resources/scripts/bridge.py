import os
import signal
from subprocess import Popen, STDOUT 

# see https://stackoverflow.com/a/11270665/996249
# and https://stackoverflow.com/a/4791612/996249
try:
    from subprocess import DEVNULL
except ImportError:
    import os
    DEVNULL = open(os.devnull, 'wb')

rsync = Popen(['vagrant', 'rsync-auto'], stdout=DEVNULL, stderr=STDOUT, preexec_fn=os.setsid)

ssh = Popen(['vagrant', 'ssh'])
ssh.communicate()

os.killpg(os.getpgid(rsync.pid), signal.SIGTERM)
