# Base44 Premium Motion - acceptance checklist

- [ ] App initial shell appears once, never remains blank; no white flash between states.
- [ ] Direct load of nested URLs renders correctly and does not depend on navigation from home.
- [ ] SPA navigation forward/back works; route exit only where technically controllable.
- [ ] Rapid route taps do not lock content or leave a disabled overlay.
- [ ] Forms preserve input values where required; no remount due to unstable route keys.
- [ ] Authentication, role permissions and SDK queries are unchanged.
- [ ] Dialog closes with motion, keyboard Escape, focus restore and screen reader semantics.
- [ ] Focus visible, tab order, touch access and pointer events work at every stage.
- [ ] Motion reduced mode uses no meaningful translation/scale/stagger.
- [ ] No animation conflicts with Tailwind/UI libraries/transforms.
- [ ] Low-end mobile, Safari/iOS, Chrome/Android and desktop inspected.
- [ ] Avoid repeated layout shifts and scroll jumps; test slow network/loading.
- [ ] Performance profiling done with representative records; no claim of guaranteed 60 FPS.
- [ ] Track modified files, observed timings, routes tested and known exceptions.
