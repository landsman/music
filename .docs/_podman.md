# Podman

If you are switching between Docker Desktop and Podman, you probably got some errors.
Here is my troubleshooting:

```bash
docker context ls
docker context use default desktop-linux
```

Otherwise, I got this error:

```log
Error response from daemon: failed to create new hosts file: unable to replace "host-gateway" of host entry "host.docker.internal:host-gateway": host containers internal IP address is empty
```
