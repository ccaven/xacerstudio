import { Raycaster as v, Vector2 as d } from "./three.js";

var c = class {
        target;
        name;
        intersected;
        wasIntersected = !1;
        distance;
        constructor(e, n) {
            (this.target = e),
                (this.name = n),
                (this.intersected = !1),
                (this.distance = 0);
        }
    },
    i = class {
        type;
        cancelBubble;
        originalEvent;
        coords = new d(0, 0);
        distance = 0;
        intersected = !1;
        constructor(e, n = null) {
            (this.cancelBubble = !1), (this.type = e), (this.originalEvent = n);
        }
        stopPropagation() {
            this.cancelBubble = !0;
        }
    },
    h = class {
        bindEventsOnBodyElement = !0;
        autoAdd = !1;
        scene = null;
        constructor(e) {
            e &&
                typeof e.bindEventsOnBodyElement < "u" &&
                (this.bindEventsOnBodyElement = e.bindEventsOnBodyElement),
                e && typeof e.scene < "u" && (this.scene = e.scene),
                e && typeof e.autoAdd < "u" && (this.autoAdd = e.autoAdd);
        }
    },
    a = class {
        renderer;
        camera;
        domElement;
        bindEventsOnBodyElement;
        autoAdd;
        scene;
        mouse;
        supportsPointerEvents;
        interactiveObjects;
        closestObject;
        raycaster;
        treatTouchEventsAsMouseEvents;
        constructor(e, n, t, s) {
            (this.renderer = e),
                (this.camera = n),
                (this.domElement = t),
                (this.bindEventsOnBodyElement =
                    s && typeof s.bindEventsOnBodyElement < "u"
                        ? s.bindEventsOnBodyElement
                        : !0),
                (this.scene = s && typeof s.scene < "u" ? s.scene : null),
                this.scene &&
                    (this.scene.onBeforeRender = () => {
                        this.autoAdd &&
                            this.scene !== null &&
                            this.scene.traverse((o) => {
                                this.add(o),
                                    o.addEventListener("removed", (u) => {
                                        this.remove(u.target);
                                    });
                            }),
                            this.update();
                    }),
                (this.autoAdd = s && typeof s.autoAdd < "u" ? s.autoAdd : !1),
                this.autoAdd &&
                    this.scene === null &&
                    console.error(
                        "Attention: Options.scene needs to be set when using options.autoAdd"
                    ),
                (this.mouse = new d(-1, 1)),
                (this.supportsPointerEvents = !!window.PointerEvent),
                (this.interactiveObjects = []),
                (this.closestObject = null),
                (this.raycaster = new v()),
                t.addEventListener("click", this.onMouseClick),
                this.supportsPointerEvents &&
                    (this.bindEventsOnBodyElement
                        ? t.ownerDocument.addEventListener(
                              "pointermove",
                              this.onDocumentPointerMove
                          )
                        : t.addEventListener(
                              "pointermove",
                              this.onDocumentPointerMove
                          ),
                    t.addEventListener("pointerdown", this.onPointerDown),
                    t.addEventListener("pointerup", this.onPointerUp)),
                this.bindEventsOnBodyElement
                    ? t.ownerDocument.addEventListener(
                          "mousemove",
                          this.onDocumentMouseMove
                      )
                    : t.addEventListener("mousemove", this.onDocumentMouseMove),
                t.addEventListener("mousedown", this.onMouseDown),
                t.addEventListener("mouseup", this.onMouseUp),
                t.addEventListener("touchstart", this.onTouchStart, {
                    passive: !0,
                }),
                t.addEventListener("touchmove", this.onTouchMove, {
                    passive: !0,
                }),
                t.addEventListener("touchend", this.onTouchEnd, {
                    passive: !0,
                }),
                (this.treatTouchEventsAsMouseEvents = !0);
        }
        dispose = () => {
            this.domElement.removeEventListener("click", this.onMouseClick),
                this.supportsPointerEvents &&
                    (this.bindEventsOnBodyElement
                        ? this.domElement.ownerDocument.removeEventListener(
                              "pointermove",
                              this.onDocumentPointerMove
                          )
                        : this.domElement.removeEventListener(
                              "pointermove",
                              this.onDocumentPointerMove
                          ),
                    this.domElement.removeEventListener(
                        "pointerdown",
                        this.onPointerDown
                    ),
                    this.domElement.removeEventListener(
                        "pointerup",
                        this.onPointerUp
                    )),
                this.bindEventsOnBodyElement
                    ? this.domElement.ownerDocument.removeEventListener(
                          "mousemove",
                          this.onDocumentMouseMove
                      )
                    : this.domElement.removeEventListener(
                          "mousemove",
                          this.onDocumentMouseMove
                      ),
                this.domElement.removeEventListener(
                    "mousedown",
                    this.onMouseDown
                ),
                this.domElement.removeEventListener("mouseup", this.onMouseUp),
                this.domElement.removeEventListener(
                    "touchstart",
                    this.onTouchStart
                ),
                this.domElement.removeEventListener(
                    "touchmove",
                    this.onTouchMove
                ),
                this.domElement.removeEventListener(
                    "touchend",
                    this.onTouchEnd
                );
        };
        add = (e, n = []) => {
            if (e && !this.interactiveObjects.find((t) => t.target === e))
                if (n.length > 0)
                    n.forEach((t) => {
                        let s = e.getObjectByName(t);
                        if (s) {
                            let o = new c(s, t);
                            this.interactiveObjects.push(o);
                        }
                    });
                else {
                    let t = new c(e, e.name);
                    this.interactiveObjects.push(t);
                }
        };
        remove = (e, n = []) => {
            !e ||
                (n.length > 0
                    ? n.forEach((t) => {
                          let s = e.getObjectByName(t);
                          s &&
                              (this.interactiveObjects =
                                  this.interactiveObjects.filter(
                                      (o) => o.target !== s
                                  ));
                      })
                    : (this.interactiveObjects = this.interactiveObjects.filter(
                          (t) => t.target !== e
                      )));
        };
        update = () => {
            this.raycaster.setFromCamera(this.mouse, this.camera),
                this.interactiveObjects.forEach((s) => {
                    s.target && this.checkIntersection(s);
                }),
                this.interactiveObjects.sort(function (s, o) {
                    return s.distance - o.distance;
                });
            let e = this.interactiveObjects.find((s) => s.intersected) ?? null;
            if (e != this.closestObject) {
                if (this.closestObject) {
                    let s = new i("mouseout");
                    this.dispatch(this.closestObject, s);
                }
                if (e) {
                    let s = new i("mouseover");
                    this.dispatch(e, s);
                }
                this.closestObject = e;
            }
            let n;
            this.interactiveObjects.forEach((s) => {
                !s.intersected &&
                    s.wasIntersected &&
                    (n || (n = new i("mouseleave")), this.dispatch(s, n));
            });
            let t;
            this.interactiveObjects.forEach((s) => {
                s.intersected &&
                    !s.wasIntersected &&
                    (t || (t = new i("mouseenter")), this.dispatch(s, t));
            });
        };
        checkIntersection = (e) => {
            let n = this.raycaster.intersectObjects([e.target], !0);
            if (((e.wasIntersected = e.intersected), n.length > 0)) {
                let t = n[0].distance;
                n.forEach((s) => {
                    s.distance < t && (t = s.distance);
                }),
                    (e.intersected = !0),
                    (e.distance = t);
            } else e.intersected = !1;
        };
        onDocumentMouseMove = (e) => {
            this.mapPositionToPoint(this.mouse, e.clientX, e.clientY);
            let n = new i("mousemove", e);
            this.interactiveObjects.forEach((t) => {
                this.dispatch(t, n);
            });
        };
        onDocumentPointerMove = (e) => {
            this.mapPositionToPoint(this.mouse, e.clientX, e.clientY);
            let n = new i("pointermove", e);
            this.interactiveObjects.forEach((t) => {
                this.dispatch(t, n);
            });
        };
        onTouchMove = (e) => {
            e.touches.length > 0 &&
                this.mapPositionToPoint(
                    this.mouse,
                    e.touches[0].clientX,
                    e.touches[0].clientY
                );
            let n = new i(
                this.treatTouchEventsAsMouseEvents ? "mousemove" : "touchmove",
                e
            );
            this.interactiveObjects.forEach((t) => {
                this.dispatch(t, n);
            });
        };
        onMouseClick = (e) => {
            this.update();
            let n = new i("click", e);
            this.interactiveObjects.forEach((t) => {
                t.intersected && this.dispatch(t, n);
            });
        };
        onMouseDown = (e) => {
            this.mapPositionToPoint(this.mouse, e.clientX, e.clientY),
                this.update();
            let n = new i("mousedown", e);
            this.interactiveObjects.forEach((t) => {
                t.intersected && this.dispatch(t, n);
            });
        };
        onPointerDown = (e) => {
            this.mapPositionToPoint(this.mouse, e.clientX, e.clientY),
                this.update();
            let n = new i("pointerdown", e);
            this.interactiveObjects.forEach((t) => {
                t.intersected && this.dispatch(t, n);
            });
        };
        onTouchStart = (e) => {
            e.touches.length > 0 &&
                this.mapPositionToPoint(
                    this.mouse,
                    e.touches[0].clientX,
                    e.touches[0].clientY
                ),
                this.update();
            let n = new i(
                this.treatTouchEventsAsMouseEvents ? "mousedown" : "touchstart",
                e
            );
            this.interactiveObjects.forEach((t) => {
                t.intersected && this.dispatch(t, n);
            });
        };
        onMouseUp = (e) => {
            let n = new i("mouseup", e);
            this.interactiveObjects.forEach((t) => {
                this.dispatch(t, n);
            });
        };
        onPointerUp = (e) => {
            let n = new i("pointerup", e);
            this.interactiveObjects.forEach((t) => {
                this.dispatch(t, n);
            });
        };
        onTouchEnd = (e) => {
            e.touches.length > 0 &&
                this.mapPositionToPoint(
                    this.mouse,
                    e.touches[0].clientX,
                    e.touches[0].clientY
                ),
                this.update();
            let n = new i(
                this.treatTouchEventsAsMouseEvents ? "mouseup" : "touchend",
                e
            );
            this.interactiveObjects.forEach((t) => {
                this.dispatch(t, n);
            });
        };
        dispatch = (e, n) => {
            e.target &&
                !n.cancelBubble &&
                ((n.coords = this.mouse),
                (n.distance = e.distance),
                (n.intersected = e.intersected),
                e.target.dispatchEvent(n));
        };
        mapPositionToPoint = (e, n, t) => {
            let s = this.renderer.domElement.getBoundingClientRect();
            (e.x = ((n - s.left) / s.width) * 2 - 1),
                (e.y = -((t - s.top) / s.height) * 2 + 1);
        };
    };
export {
    a as InteractionManager,
    h as InteractionManagerOptions,
    i as InteractiveEvent,
    c as InteractiveObject,
};
