(function () {
	var g = void 0,
		h = !0,
		i = null,
		k = !1,
		aa = encodeURIComponent,
		ba = Infinity,
		ea = setTimeout,
		fa = decodeURIComponent,
		l = Math;

	function ga(a, b) {
		return a.name = b
	}
	var m = "push",
		ha = "slice",
		n = "replace",
		ia = "load",
		ja = "floor",
		ka = "charAt",
		la = "value",
		p = "indexOf",
		ma = "match",
		na = "port",
		oa = "createElement",
		pa = "path",
		q = "name",
		t = "host",
		u = "toString",
		v = "length",
		w = "prototype",
		qa = "clientWidth",
		x = "split",
		ra = "stopPropagation",
		ta = "scope",
		y = "location",
		ua = "search",
		z = "protocol",
		va = "clientHeight",
		wa = "href",
		A = "substring",
		xa = "apply",
		ya = "navigator",
		B = "join",
		C = "toLowerCase",
		D;

	function za(a, b) {
		switch (b) {
		case 0:
			return "" + a;
		case 1:
			return 1 * a;
		case 2:
			return !!a;
		case 3:
			return 1E3 * a
		}
		return a
	}
	function Aa(a) {
		return "function" == typeof a
	}
	function Ba(a) {
		return a != g && -1 < (a.constructor + "")[p]("String")
	}
	function E(a, b) {
		return g == a || "-" == a && !b || "" == a
	}
	function Ca(a) {
		if (!a || "" == a) return "";
		for (; a && -1 < " \n\r\t" [p](a[ka](0));) a = a[A](1);
		for (; a && -1 < " \n\r\t" [p](a[ka](a[v] - 1));) a = a[A](0, a[v] - 1);
		return a
	}

	function F(a) {
		var b = 1,
			c = 0,
			d;
		if (!E(a)) {
			b = 0;
			for (d = a[v] - 1; 0 <= d; d--) c = a.charCodeAt(d), b = (b << 6 & 268435455) + c + (c << 14), c = b & 266338304, b = 0 != c ? b ^ c >> 21 : b
		}
		return b
	}
	function Da() {
		return l.round(2147483647 * l.random())
	}
	function Ea() {}
	function G(a, b) {
		if (aa instanceof Function) return b ? encodeURI(a) : aa(a);
		H(68);
		return escape(a)
	}
	function I(a) {
		a = a[x]("+")[B](" ");
		if (fa instanceof Function) try {
			return fa(a)
		} catch (b) {
			H(17)
		} else H(68);
		return unescape(a)
	}
	var Fa = function (a, b, c, d) {
			a.addEventListener ? a.addEventListener(b, c, !! d) : a.attachEvent && a.attachEvent("on" + b, c)
		},
		Ga = function (a, b, c, d) {
			a.removeEventListener ? a.removeEventListener(b, c, !! d) : a.detachEvent && a.detachEvent("on" + b, c)
		};

	function Ha(a, b) {
		if (a) {
			var c = J[oa]("script");
			c.type = "text/javascript";
			c.async = h;
			c.src = a;
			c.id = b;
			var d = J.getElementsByTagName("script")[0];
			d.parentNode.insertBefore(c, d);
			return c
		}
	}
	function K(a) {
		return a && 0 < a[v] ? a[0] : ""
	}
	function Ia(a) {
		var b = a ? a[v] : 0;
		return 0 < b ? a[b - 1] : ""
	}
	var Ja = function () {
			this.prefix = "ga.";
			this.R = {}
		};
	Ja[w].set = function (a, b) {
		this.R[this.prefix + a] = b
	};
	Ja[w].get = function (a) {
		return this.R[this.prefix + a]
	};
	Ja[w].contains = function (a) {
		return this.get(a) !== g
	};

	function Ka(a) {
		0 == a[p]("www.") && (a = a[A](4));
		return a[C]()
	}
	function La(a, b) {
		var c, d = {
			url: a,
			protocol: "http",
			host: "",
			path: "",
			d: new Ja,
			anchor: ""
		};
		if (!a) return d;
		c = a[p]("://");
		0 <= c && (d.protocol = a[A](0, c), a = a[A](c + 3));
		c = a[ua]("/|\\?|#");
		if (0 <= c) d.host = a[A](0, c)[C](), a = a[A](c);
		else return d.host = a[C](), d;
		c = a[p]("#");
		0 <= c && (d.anchor = a[A](c + 1), a = a[A](0, c));
		c = a[p]("?");
		0 <= c && (Ma(d.d, a[A](c + 1)), a = a[A](0, c));
		d.anchor && b && Ma(d.d, d.anchor);
		a && "/" == a[ka](0) && (a = a[A](1));
		d.path = a;
		return d
	}

	function Na(a, b) {
		function c(a) {
			var b = (a.hostname || "")[x](":")[0][C](),
				c = (a[z] || "")[C](),
				c = 1 * a[na] || ("http:" == c ? 80 : "https:" == c ? 443 : ""),
				a = a.pathname || "";
			0 == a[p]("/") || (a = "/" + a);
			return [b, "" + c, a]
		}
		var d = b || J[oa]("a");
		d.href = J[y][wa];
		var e = (d[z] || "")[C](),
			f = c(d),
			j = d[ua] || "",
			o = e + "//" + f[0] + (f[1] ? ":" + f[1] : "");
		0 == a[p]("//") ? a = e + a : 0 == a[p]("/") ? a = o + a : !a || 0 == a[p]("?") ? a = o + f[2] + (a || j) : 0 > a[x]("/")[0][p](":") && (a = o + f[2][A](0, f[2].lastIndexOf("/")) + "/" + a);
		d.href = a;
		e = c(d);
		return {
			protocol: (d[z] || "")[C](),
			host: e[0],
			port: e[1],
			path: e[2],
			Ia: d[ua] || "",
			url: a || ""
		}
	}
	function Ma(a, b) {
		function c(b, c) {
			a.contains(b) || a.set(b, []);
			a.get(b)[m](c)
		}
		for (var d = Ca(b)[x]("&"), e = 0; e < d[v]; e++) if (d[e]) {
			var f = d[e][p]("=");
			0 > f ? c(d[e], "1") : c(d[e][A](0, f), d[e][A](f + 1))
		}
	}
	function Oa(a, b) {
		if (E(a) || "[" == a[ka](0) && "]" == a[ka](a[v] - 1)) return "-";
		var c = J.domain;
		return a[p](c + (b && "/" != b ? b : "")) == (0 == a[p]("http://") ? 7 : 0 == a[p]("https://") ? 8 : 0) ? "0" : a
	};
	var Pa = 0;

	function Ra(a, b, c) {
		!(1 <= Pa) && !(1 <= 100 * l.random()) && (a = ["utmt=error", "utmerr=" + a, "utmwv=5.3.0", "utmn=" + Da(), "utmsp=1"], b && a[m]("api=" + b), c && a[m]("msg=" + G(c[A](0, 100))), L.A && a[m]("aip=1"), Sa(a[B]("&")), Pa++)
	};
	var Ta = 0,
		Ua = {};

	function M(a) {
		return Va("x" + Ta++, a)
	}
	function Va(a, b) {
		Ua[a] = !! b;
		return a
	}
	var N = M(),
		Wa = M(),
		Xa = M(),
		Ya = M(),
		Za = M(),
		O = M(),
		P = M(),
		$a = M(),
		ab = M(),
		bb = M(),
		cb = M(),
		db = M(),
		eb = M(),
		fb = M(),
		gb = M(),
		hb = M(),
		ib = M(),
		jb = M(),
		kb = M(),
		lb = M(),
		mb = M(),
		nb = M(),
		ob = M(),
		pb = M(),
		qb = M(),
		rb = M(),
		sb = M(),
		tb = M(),
		ub = M(),
		vb = M(),
		wb = M(),
		xb = M(),
		yb = M(),
		zb = M(),
		Ab = M(),
		Q = M(h),
		Bb = Va("page"),
		Cb = Va("title"),
		Db = M(),
		Eb = M(),
		Fb = M(),
		Gb = M(),
		Hb = M(),
		Ib = M(),
		Jb = M(),
		Kb = M(),
		Lb = M(),
		R = M(h),
		Mb = M(h),
		Nb = M(h),
		Qb = M(h),
		Rb = M(h),
		Sb = M(h),
		Tb = M(h),
		Ub = M(h),
		Vb = M(h),
		Wb = M(h),
		Xb = M(h),
		S = M(h),
		Yb = M(h),
		Zb = M(h),
		$b = M(h),
		ac = M(h),
		bc = M(h),
		cc = M(h),
		dc = M(h),
		ec = M(h),
		fc = M(h),
		gc = M(h),
		hc = M(h),
		ic = M(h),
		jc = M(h),
		kc = Va("campaignParams"),
		lc = M(),
		mc = Va("hitCallback"),
		nc = M();
	M();
	var oc = M(),
		pc = M(),
		qc = M(),
		rc = M(),
		sc = M(),
		tc = M(),
		uc = M(),
		vc = M(),
		wc = M(),
		xc = M(),
		yc = M(),
		Cc = M();
	M();
	var Dc = M(),
		Ec = M(),
		Fc = M();
	var Ic = function () {
			function a(a, c, d) {
				T(U[w], a, c, d)
			}
			Gc("_getName", Xa, 58);
			Gc("_getAccount", N, 64);
			Gc("_visitCode", R, 54);
			Gc("_getClientInfo", fb, 53, 1);
			Gc("_getDetectTitle", ib, 56, 1);
			Gc("_getDetectFlash", gb, 65, 1);
			Gc("_getLocalGifPath", sb, 57);
			Gc("_getServiceMode", tb, 59);
			V("_setClientInfo", fb, 66, 2);
			V("_setAccount", N, 3);
			V("_setNamespace", Wa, 48);
			V("_setAllowLinker", cb, 11, 2);
			V("_setDetectFlash", gb, 61, 2);
			V("_setDetectTitle", ib, 62, 2);
			V("_setLocalGifPath", sb, 46, 0);
			V("_setLocalServerMode", tb, 92, g, 0);
			V("_setRemoteServerMode", tb, 63, g, 1);
			V("_setLocalRemoteServerMode", tb, 47, g, 2);
			V("_setSampleRate", rb, 45, 1);
			V("_setCampaignTrack", hb, 36, 2);
			V("_setAllowAnchor", db, 7, 2);
			V("_setCampNameKey", kb, 41);
			V("_setCampContentKey", pb, 38);
			V("_setCampIdKey", jb, 39);
			V("_setCampMediumKey", nb, 40);
			V("_setCampNOKey", qb, 42);
			V("_setCampSourceKey", mb, 43);
			V("_setCampTermKey", ob, 44);
			V("_setCampCIdKey", lb, 37);
			V("_setCookiePath", P, 9, 0);
			V("_setMaxCustomVariables", ub, 0, 1);
			V("_setVisitorCookieTimeout", $a, 28, 1);
			V("_setSessionCookieTimeout", ab, 26, 1);
			V("_setCampaignCookieTimeout", bb, 29, 1);
			V("_setReferrerOverride", Db, 49);
			V("_setSiteSpeedSampleRate", wc, 132);
			a("_trackPageview", U[w].ya, 1);
			a("_trackEvent", U[w].D, 4);
			a("_trackPageLoadTime", U[w].xa, 100);
			a("_trackSocial", U[w].za, 104);
			a("_trackTrans", U[w].Ba, 18);
			a("_sendXEvent", U[w].t, 78);
			a("_createEventTracker", U[w].ea, 74);
			a("_getVersion", U[w].ja, 60);
			a("_setDomainName", U[w].C, 6);
			a("_setAllowHash", U[w].oa, 8);
			a("_getLinkerUrl", U[w].ia, 52);
			a("_link", U[w].link, 101);
			a("_linkByPost", U[w].na, 102);
			a("_setTrans", U[w].sa, 20);
			a("_addTrans", U[w].Y, 21);
			a("_addItem", U[w].W, 19);
			a("_setTransactionDelim", U[w].ta, 82);
			a("_setCustomVar", U[w].pa, 10);
			a("_deleteCustomVar", U[w].ga, 35);
			a("_getVisitorCustomVar", U[w].ka, 50);
			a("_setXKey", U[w].va, 83);
			a("_setXValue", U[w].wa, 84);
			a("_getXKey", U[w].la, 76);
			a("_getXValue", U[w].ma, 77);
			a("_clearXKey", U[w].ba, 72);
			a("_clearXValue", U[w].ca, 73);
			a("_createXObj", U[w].fa, 75);
			a("_addIgnoredOrganic", U[w].U, 15);
			a("_clearIgnoredOrganic", U[w].Z, 97);
			a("_addIgnoredRef", U[w].V, 31);
			a("_clearIgnoredRef", U[w].$, 32);
			a("_addOrganic", U[w].X, 14);
			a("_clearOrganic", U[w].aa, 70);
			a("_cookiePathCopy", U[w].da, 30);
			a("_get", U[w].ha, 106);
			a("_set", U[w].qa, 107);
			a("_addEventListener", U[w].addEventListener, 108);
			a("_removeEventListener", U[w].removeEventListener, 109);
			a("_addDevId", U[w].T);
			a("_getPlugin", Hc, 122);
			a("_setPageGroup", U[w].ra, 126);
			a("_trackTiming", U[w].Aa, 124);
			a("_initData", U[w].u, 2);
			a("_setVar", U[w].ua, 22);
			V("_setSessionTimeout", ab, 27, 3);
			V("_setCookieTimeout", bb, 25, 3);
			V("_setCookiePersistence", $a, 24, 1);
			a("_setAutoTrackOutbound", Ea, 79);
			a("_setTrackOutboundSubdomains", Ea, 81);
			a("_setHrefExamineLimit", Ea, 80)
		};

	function Hc(a) {
		var b = this.plugins_;
		if (b) return b.get(a)
	}
	var T = function (a, b, c, d) {
			a[b] = function () {
				try {
					return d != g && H(d), c[xa](this, arguments)
				} catch (a) {
					throw Ra("exc", b, a && a[q]), a;
				}
			}
		},
		Gc = function (a, b, c, d) {
			U[w][a] = function () {
				try {
					return H(c), za(this.a.get(b), d)
				} catch (e) {
					throw Ra("exc", a, e && e[q]), e;
				}
			}
		},
		V = function (a, b, c, d, e) {
			U[w][a] = function (f) {
				try {
					H(c), e == g ? this.a.set(b, za(f, d)) : this.a.set(b, e)
				} catch (j) {
					throw Ra("exc", a, j && j[q]), j;
				}
			}
		},
		Jc = function (a, b) {
			return {
				type: b,
				target: a,
				stopPropagation: function () {
					throw "aborted";
				}
			}
		};
	var Kc = function (a, b) {
			return "/" !== b ? k : (0 == a[p]("www.google.") || 0 == a[p](".google.") || 0 == a[p]("google.")) && !(-1 < a[p]("google.org")) ? h : k
		},
		Lc = function (a) {
			var b = a.get(Za),
				c = a.c(P, "/");
			Kc(b, c) && a[ra]()
		};
	var Qc = function () {
			var a = {},
				b = {},
				c = new Mc;
			this.j = function (a, b) {
				c.add(a, b)
			};
			var d = new Mc;
			this.e = function (a, b) {
				d.add(a, b)
			};
			var e = k,
				f = k,
				j = h;
			this.S = function () {
				e = h
			};
			this.i = function (a) {
				this[ia]();
				this.set(lc, a, h);
				a = new Nc(this);
				e = k;
				d.execute(this);
				e = h;
				b = {};
				this.n();
				a.Ca()
			};
			this.load = function () {
				e && (e = k, this.Da(), Oc(this), f || (f = h, c.execute(this), Pc(this), Oc(this)), e = h)
			};
			this.n = function () {
				if (e) if (f) e = k, Pc(this), e = h;
				else this[ia]()
			};
			this.get = function (c) {
				Ua[c] && this[ia]();
				return b[c] !== g ? b[c] : a[c]
			};
			this.set = function (c, d, e) {
				Ua[c] && this[ia]();
				e ? b[c] = d : a[c] = d;
				Ua[c] && this.n()
			};
			this.v = function (b) {
				a[b] = this.b(b, 0) + 1
			};
			this.b = function (a, b) {
				var c = this.get(a);
				return c == g || "" === c ? b : 1 * c
			};
			this.c = function (a, b) {
				var c = this.get(a);
				return c == g ? b : c + ""
			};
			this.Da = function () {
				if (j) {
					var b = this.c(Za, ""),
						c = this.c(P, "/");
					Kc(b, c) || (a[O] = a[eb] && "" != b ? F(b) : 1, j = k)
				}
			}
		};
	Qc[w].stopPropagation = function () {
		throw "aborted";
	};
	var Nc = function (a) {
			var b = this;
			this.q = 0;
			var c = a.get(mc);
			this.Sa = function () {
				0 < b.q && c && (b.q--, b.q || c())
			};
			this.Ca = function () {
				!b.q && c && ea(c, 10)
			};
			a.set(nc, b, h)
		};

	function Rc(a, b) {
		for (var b = b || [], c = 0; c < b[v]; c++) {
			var d = b[c];
			if ("" + a == d || 0 == d[p](a + ".")) return d
		}
		return "-"
	}
	var Tc = function (a, b, c) {
			c = c ? "" : a.c(O, "1");
			b = b[x](".");
			if (6 !== b[v] || Sc(b[0], c)) return k;
			var c = 1 * b[1],
				d = 1 * b[2],
				e = 1 * b[3],
				f = 1 * b[4],
				b = 1 * b[5];
			if (!(0 <= c && 0 < d && 0 < e && 0 < f && 0 <= b)) return H(110), k;
			a.set(R, c);
			a.set(Rb, d);
			a.set(Sb, e);
			a.set(Tb, f);
			a.set(Ub, b);
			return h
		},
		Uc = function (a) {
			var b = a.get(R),
				c = a.get(Rb),
				d = a.get(Sb),
				e = a.get(Tb),
				f = a.b(Ub, 1);
			b == g ? H(113) : NaN == b && H(114);
			0 <= b && 0 < c && 0 < d && 0 < e && 0 <= f || H(115);
			return [a.b(O, 1), b != g ? b : "-", c || "-", d || "-", e || "-", f][B](".")
		},
		Vc = function (a) {
			return [a.b(O, 1), a.b(Xb, 0), a.b(S, 1), a.b(Yb, 0)][B](".")
		},
		Wc = function (a, b, c) {
			var c = c ? "" : a.c(O, "1"),
				d = b[x](".");
			if (4 !== d[v] || Sc(d[0], c)) d = i;
			a.set(Xb, d ? 1 * d[1] : 0);
			a.set(S, d ? 1 * d[2] : 10);
			a.set(Yb, d ? 1 * d[3] : a.get(Ya));
			return d != i || !Sc(b, c)
		},
		Xc = function (a, b) {
			var c = G(a.c(Nb, "")),
				d = [],
				e = a.get(Q);
			if (!b && e) {
				for (var f = 0; f < e[v]; f++) {
					var j = e[f];
					j && 1 == j[ta] && d[m](f + "=" + G(j[q]) + "=" + G(j[la]) + "=1")
				}
				0 < d[v] && (c += "|" + d[B]("^"))
			}
			return c ? a.b(O, 1) + "." + c : i
		},
		Yc = function (a, b, c) {
			c = c ? "" : a.c(O, "1");
			b = b[x](".");
			if (2 > b[v] || Sc(b[0], c)) return k;
			b = b[ha](1)[B](".")[x]("|");
			0 < b[v] && a.set(Nb, I(b[0]));
			if (1 >= b[v]) return h;
			b = b[1][x](-1 == b[1][p](",") ? "^" : ",");
			for (c = 0; c < b[v]; c++) {
				var d = b[c][x]("=");
				if (4 == d[v]) {
					var e = {};
					ga(e, I(d[1]));
					e.value = I(d[2]);
					e.scope = 1;
					a.get(Q)[d[0]] = e
				}
			}
			return h
		},
		$c = function (a, b) {
			var c = Zc(a, b);
			return c ? [a.b(O, 1), a.b(Zb, 0), a.b($b, 1), a.b(ac, 1), c][B](".") : ""
		},
		Zc = function (a) {
			function b(b, e) {
				if (!E(a.get(b))) {
					var f = a.c(b, ""),
						f = f[x](" ")[B]("%20"),
						f = f[x]("+")[B]("%20");
					c[m](e + "=" + f)
				}
			}
			var c = [];
			b(cc, "utmcid");
			b(gc, "utmcsr");
			b(ec, "utmgclid");
			b(fc, "utmdclid");
			b(dc, "utmccn");
			b(hc, "utmcmd");
			b(ic, "utmctr");
			b(jc, "utmcct");
			return c[B]("|")
		},
		bd = function (a, b, c) {
			c = c ? "" : a.c(O, "1");
			b = b[x](".");
			if (5 > b[v] || Sc(b[0], c)) return a.set(Zb, g), a.set($b, g), a.set(ac, g), a.set(cc, g), a.set(dc, g), a.set(gc, g), a.set(hc, g), a.set(ic, g), a.set(jc, g), a.set(ec, g), a.set(fc, g), k;
			a.set(Zb, 1 * b[1]);
			a.set($b, 1 * b[2]);
			a.set(ac, 1 * b[3]);
			ad(a, b[ha](4)[B]("."));
			return h
		},
		ad = function (a, b) {
			function c(a) {
				return (a = b[ma](a + "=(.*?)(?:\\|utm|$)")) && 2 == a[v] ? a[1] : g
			}
			function d(b, c) {
				c && (c = e ? I(c) : c[x]("%20")[B](" "), a.set(b, c))
			} - 1 == b[p]("=") && (b = I(b));
			var e = "2" == c("utmcvr");
			d(cc, c("utmcid"));
			d(dc, c("utmccn"));
			d(gc, c("utmcsr"));
			d(hc, c("utmcmd"));
			d(ic, c("utmctr"));
			d(jc, c("utmcct"));
			d(ec, c("utmgclid"));
			d(fc, c("utmdclid"))
		},
		Sc = function (a, b) {
			return b ? a != b : !/^\d+$/.test(a)
		};
	var Mc = function () {
			this.B = []
		};
	Mc[w].add = function (a, b) {
		this.B[m]({
			name: a,
			r: b
		})
	};
	Mc[w].execute = function (a) {
		try {
			for (var b = 0; b < this.B[v]; b++) this.B[b].r.call(W, a)
		} catch (c) {}
	};

	function cd(a) {
		100 != a.get(rb) && a.get(R) % 1E4 >= 100 * a.get(rb) && a[ra]()
	}
	function dd(a) {
		ed(a.get(N)) && a[ra]()
	}
	function fd(a) {
		"file:" == J[y][z] && a[ra]()
	}
	function gd(a) {
		a.get(Cb) || a.set(Cb, J.title, h);
		a.get(Bb) || a.set(Bb, J[y].pathname + J[y][ua], h)
	};
	var hd = new function () {
			var a = [];
			this.set = function (b) {
				a[b] = h
			};
			this.Va = function () {
				for (var b = [], c = 0; c < a[v]; c++) a[c] && (b[l[ja](c / 6)] = b[l[ja](c / 6)] ^ 1 << c % 6);
				for (c = 0; c < b[v]; c++) b[c] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_" [ka](b[c] || 0);
				return b[B]("") + "~"
			}
		};

	function H(a) {
		hd.set(a)
	};
	var W = window,
		J = document,
		ed = function (a) {
			var b = W._gaUserPrefs;
			return b && b.ioo && b.ioo() || !! a && W["ga-disable-" + a] === h
		},
		id = function (a, b) {
			ea(a, b)
		},
		jd = function (a) {
			for (var b = [], c = J.cookie[x](";"), a = RegExp("^\\s*" + a + "=\\s*(.*?)\\s*$"), d = 0; d < c[v]; d++) {
				var e = c[d][ma](a);
				e && b[m](e[1])
			}
			return b
		},
		X = function (a, b, c, d, e, f) {
			e = ed(e) ? k : Kc(d, c) ? k : h;
			if (e) {
				if (b && 0 <= W[ya].userAgent[p]("Firefox")) for (var b = b[n](/\n|\r/g, " "), e = 0, j = b[v]; e < j; ++e) {
					var o = b.charCodeAt(e) & 255;
					if (10 == o || 13 == o) b = b[A](0, e) + "?" + b[A](e + 1)
				}
				b && 2E3 < b[v] && (b = b[A](0, 2E3), H(69));
				a = a + "=" + b + "; path=" + c + "; ";
				f && (a += "expires=" + (new Date((new Date).getTime() + f)).toGMTString() + "; ");
				d && (a += "domain=" + d + ";");
				J.cookie = a
			}
		};
	var kd, ld, md = function () {
			if (!kd) {
				var a = {},
					b = W[ya],
					c = W.screen;
				a.Q = c ? c.width + "x" + c.height : "-";
				a.P = c ? c.colorDepth + "-bit" : "-";
				a.language = (b && (b.language || b.browserLanguage) || "-")[C]();
				a.javaEnabled = b && b.javaEnabled() ? 1 : 0;
				a.characterSet = J.characterSet || J.charset || "-";
				try {
					var d = J.documentElement,
						e = J.body,
						f = e && e[qa] && e[va],
						b = [];
					d && (d[qa] && d[va]) && ("CSS1Compat" === J.compatMode || !f) ? b = [d[qa], d[va]] : f && (b = [e[qa], e[va]]);
					a.Ua = b[B]("x")
				} catch (j) {
					H(135)
				}
				kd = a
			}
		},
		nd = function () {
			md();
			for (var a = kd, b = W[ya], a = b.appName + b.version + a.language + b.platform + b.userAgent + a.javaEnabled + a.Q + a.P + (J.cookie ? J.cookie : "") + (J.referrer ? J.referrer : ""), b = a[v], c = W.history[v]; 0 < c;) a += c-- ^ b++;
			return F(a)
		},
		od = function (a) {
			md();
			var b = kd;
			a.set(Fb, b.Q);
			a.set(Gb, b.P);
			a.set(Jb, b.language);
			a.set(Kb, b.characterSet);
			a.set(Hb, b.javaEnabled);
			a.set(Lb, b.Ua);
			if (a.get(fb) && a.get(gb)) {
				if (!(b = ld)) {
					var c, d, e;
					d = "ShockwaveFlash";
					if ((b = (b = W[ya]) ? b.plugins : g) && 0 < b[v]) for (c = 0; c < b[v] && !e; c++) d = b[c], -1 < d[q][p]("Shockwave Flash") && (e = d.description[x]("Shockwave Flash ")[1]);
					else {
						d = d + "." + d;
						try {
							c = new ActiveXObject(d + ".7"), e = c.GetVariable("$version")
						} catch (f) {}
						if (!e) try {
							c = new ActiveXObject(d + ".6"), e = "WIN 6,0,21,0", c.AllowScriptAccess = "always", e = c.GetVariable("$version")
						} catch (j) {}
						if (!e) try {
							c = new ActiveXObject(d), e = c.GetVariable("$version")
						} catch (o) {}
						e && (e = e[x](" ")[1][x](","), e = e[0] + "." + e[1] + " r" + e[2])
					}
					b = e ? e : "-"
				}
				ld = b;
				a.set(Ib, ld)
			} else a.set(Ib, "-")
		};
	var pd = function (a) {
			if (Aa(a)) this.r = a;
			else {
				var b = a[0],
					c = b.lastIndexOf(":"),
					d = b.lastIndexOf(".");
				this.g = this.h = this.l = ""; - 1 == c && -1 == d ? this.g = b : -1 == c && -1 != d ? (this.h = b[A](0, d), this.g = b[A](d + 1)) : -1 != c && -1 == d ? (this.l = b[A](0, c), this.g = b[A](c + 1)) : c > d ? (this.h = b[A](0, d), this.l = b[A](d + 1, c), this.g = b[A](c + 1)) : (this.h = b[A](0, d), this.g = b[A](d + 1));
				this.k = a[ha](1);
				this.Fa = !this.l && "_require" == this.g;
				this.H = !this.h && !this.l && "_provide" == this.g
			}
		},
		Y = function () {
			T(Y[w], "push", Y[w][m], 5);
			T(Y[w], "_getPlugin", Hc, 121);
			T(Y[w], "_createAsyncTracker", Y[w].Qa, 33);
			T(Y[w], "_getAsyncTracker", Y[w].Ra, 34);
			this.G = new Ja;
			this.p = []
		};
	D = Y[w];
	D.Ha = function (a, b, c) {
		var d = this.G.get(a);
		if (!Aa(d)) return k;
		b.plugins_ = b.plugins_ || new Ja;
		b.plugins_.set(a, new d(b, c || {}));
		return h
	};
	D.push = function (a) {
		var b = Z.Ta[xa](this, arguments),
			b = Z.p.concat(b);
		for (Z.p = []; 0 < b[v] && !Z.O(b[0]) && !(b.shift(), 0 < Z.p[v]););
		Z.p = Z.p.concat(b);
		return 0
	};
	D.Ta = function (a) {
		for (var b = [], c = 0; c < arguments[v]; c++) try {
			var d = new pd(arguments[c]);
			d.H ? this.O(d) : b[m](d)
		} catch (e) {}
		return b
	};
	D.O = function (a) {
		try {
			if (a.r) a.r[xa](W);
			else if (a.H) this.G.set(a.k[0], a.k[1]);
			else {
				var b = "_gat" == a.h ? L : "_gaq" == a.h ? Z : L.w(a.h);
				if (a.Fa) {
					if (!this.Ha(a.k[0], b, a.k[2])) {
						if (!a.Ja) {
							var c = Na("" + a.k[1]);
							var d = c[z],
								e = J[y][z];
							var f;
							if (f = "https:" == d || d == e ? h : "http:" != d ? k : "http:" == e) {
								var j;
								a: {
									var o = Na(J[y][wa]);
									if (!(c.Ia || 0 <= c.url[p]("?") || 0 <= c[pa][p]("://") || c[t] == o[t] && c[na] == o[na])) for (var r = "http:" == c[z] ? 80 : 443, s = L.Ea, b = 0; b < s[v]; b++) if (c[t] == s[b][0] && (c[na] || r) == (s[b][1] || r) && 0 == c[pa][p](s[b][2])) {
										j = h;
										break a
									}
									j = k
								}
								f = j && !ed()
							}
							f && (a.Ja = Ha(c.url))
						}
						return h
					}
				} else a.l && (b = b.plugins_.get(a.l)), b[a.g][xa](b, a.k)
			}
		} catch (Qa) {}
	};
	D.Qa = function (a, b) {
		return L.s(a, b || "")
	};
	D.Ra = function (a) {
		return L.w(a)
	};
	var td = function () {
			function a(a, b, c, d) {
				g == f[a] && (f[a] = {});
				g == f[a][b] && (f[a][b] = []);
				f[a][b][c] = d
			}
			function b(a, b, c) {
				if (g != f[a] && g != f[a][b]) return f[a][b][c]
			}
			function c(a, b) {
				if (g != f[a] && g != f[a][b]) {
					f[a][b] = g;
					var c = h,
						d;
					for (d = 0; d < j[v]; d++) if (g != f[a][j[d]]) {
						c = k;
						break
					}
					c && (f[a] = g)
				}
			}
			function d(a) {
				var b = "",
					c = k,
					d, e;
				for (d = 0; d < j[v]; d++) if (e = a[j[d]], g != e) {
					c && (b += j[d]);
					for (var c = [], f = g, da = g, da = 0; da < e[v]; da++) if (g != e[da]) {
						f = "";
						da != Ob && g == e[da - 1] && (f += da[u]() + Qa);
						for (var sd = e[da], zc = "", Pb = g, Ac = g, Bc = g, Pb = 0; Pb < sd[v]; Pb++) Ac = sd[ka](Pb), Bc = sa[Ac], zc += g != Bc ? Bc : Ac;
						f += zc;
						c[m](f)
					}
					b += o + c[B](s) + r;
					c = k
				} else c = h;
				return b
			}
			var e = this,
				f = [],
				j = ["k", "v"],
				o = "(",
				r = ")",
				s = "*",
				Qa = "!",
				sa = {
					"'": "'0"
				};
			sa[r] = "'1";
			sa[s] = "'2";
			sa[Qa] = "'3";
			var Ob = 1;
			e.La = function (a) {
				return g != f[a]
			};
			e.z = function () {
				for (var a = "", b = 0; b < f[v]; b++) g != f[b] && (a += b[u]() + d(f[b]));
				return a
			};
			e.Ka = function (a) {
				if (a == g) return e.z();
				for (var b = a.z(), c = 0; c < f[v]; c++) g != f[c] && !a.La(c) && (b += c[u]() + d(f[c]));
				return b
			};
			e.f = function (b, c, d) {
				if (!qd(d)) return k;
				a(b, "k", c, d);
				return h
			};
			e.o = function (b, c, d) {
				if (!rd(d)) return k;
				a(b, "v", c, d[u]());
				return h
			};
			e.getKey = function (a, c) {
				return b(a, "k", c)
			};
			e.L = function (a, c) {
				return b(a, "v", c)
			};
			e.J = function (a) {
				c(a, "k")
			};
			e.K = function (a) {
				c(a, "v")
			};
			T(e, "_setKey", e.f, 89);
			T(e, "_setValue", e.o, 90);
			T(e, "_getKey", e.getKey, 87);
			T(e, "_getValue", e.L, 88);
			T(e, "_clearKey", e.J, 85);
			T(e, "_clearValue", e.K, 86)
		};

	function qd(a) {
		return "string" == typeof a
	}
	function rd(a) {
		return "number" != typeof a && (g == Number || !(a instanceof Number)) || l.round(a) != a || NaN == a || a == ba ? k : h
	};
	var ud = function (a) {
			var b = W.gaGlobal;
			a && !b && (W.gaGlobal = b = {});
			return b
		},
		vd = function () {
			var a = ud(h).hid;
			a == i && (a = Da(), ud(h).hid = a);
			return a
		},
		wd = function (a) {
			a.set(Eb, vd());
			var b = ud();
			if (b && b.dh == a.get(O)) {
				var c = b.sid;
				c && ("0" == c && H(112), a.set(Tb, c), a.get(Mb) && a.set(Sb, c));
				b = b.vid;
				a.get(Mb) && b && (b = b[x]("."), 1 * b[1] || H(112), a.set(R, 1 * b[0]), a.set(Rb, 1 * b[1]))
			}
		};
	var xd, yd = function (a, b, c) {
			var d = a.c(Za, ""),
				e = a.c(P, "/"),
				f = a.b($a, 0),
				a = a.c(N, "");
			X(b, c, e, d, a, f)
		},
		Pc = function (a) {
			var b = a.c(Za, "");
			a.b(O, 1);
			var c = a.c(P, "/"),
				d = a.c(N, "");
			X("__utma", Uc(a), c, b, d, a.get($a));
			X("__utmb", Vc(a), c, b, d, a.get(ab));
			X("__utmc", "" + a.b(O, 1), c, b, d);
			var e = $c(a, h);
			e ? X("__utmz", e, c, b, d, a.get(bb)) : X("__utmz", "", c, b, "", -1);
			(e = Xc(a, k)) ? X("__utmv", e, c, b, d, a.get($a)) : X("__utmv", "", c, b, "", -1)
		},
		Oc = function (a) {
			var b = a.b(O, 1);
			if (!Tc(a, Rc(b, jd("__utma")))) return a.set(Qb, h), k;
			var c = !Wc(a, Rc(b, jd("__utmb")));
			a.set(Wb, c);
			bd(a, Rc(b, jd("__utmz")));
			Yc(a, Rc(b, jd("__utmv")));
			xd = !c;
			return h
		},
		zd = function (a) {
			!xd && !(0 < jd("__utmb")[v]) && (X("__utmd", "1", a.c(P, "/"), a.c(Za, ""), a.c(N, ""), 1E4), 0 == jd("__utmd")[v] && a[ra]())
		};
	var Cd = function (a) {
			a.get(R) == g ? Ad(a) : a.get(Qb) && !a.get(Dc) ? Ad(a) : a.get(Wb) && Bd(a)
		},
		Dd = function (a) {
			a.get(bc) && !a.get(Vb) && (Bd(a), a.set($b, a.get(Ub)))
		},
		Ad = function (a) {
			var b = a.get(Ya);
			a.set(Mb, h);
			a.set(R, Da() ^ nd(a) & 2147483647);
			a.set(Nb, "");
			a.set(Rb, b);
			a.set(Sb, b);
			a.set(Tb, b);
			a.set(Ub, 1);
			a.set(Vb, h);
			a.set(Xb, 0);
			a.set(S, 10);
			a.set(Yb, b);
			a.set(Q, []);
			a.set(Qb, k);
			a.set(Wb, k)
		},
		Bd = function (a) {
			a.set(Sb, a.get(Tb));
			a.set(Tb, a.get(Ya));
			a.v(Ub);
			a.set(Vb, h);
			a.set(Xb, 0);
			a.set(S, 10);
			a.set(Yb, a.get(Ya));
			a.set(Wb, k)
		};
	var Ed = "daum:q eniro:search_word naver:query pchome:q images.google:q google:q yahoo:p yahoo:q msn:q bing:q aol:query aol:q lycos:q lycos:query ask:q netscape:query cnn:query about:terms mamma:q voila:rdata virgilio:qs live:q baidu:wd alice:qs yandex:text najdi:q seznam:q rakuten:qt biglobe:q goo.ne:MT wp:szukaj onet:qt yam:k kvasir:q ozu:q terra:query rambler:query conduit:q babylon:q search-results:q avg:q comcast:q incredimail:q startsiden:q go.mail.ru:q search.centrum.cz:q".split(" "),
		Kd = function (a) {
			if (a.get(hb) && !a.get(Dc)) {
				for (var b = !E(a.get(cc)) || !E(a.get(gc)) || !E(a.get(ec)) || !E(a.get(fc)), c = {}, d = 0; d < Fd[v]; d++) {
					var e = Fd[d];
					c[e] = a.get(e)
				}(d = a.get(kc)) ? (H(149), e = new Ja, Ma(e, d), d = e) : d = La(J[y][wa], a.get(db)).d;
				if (!("1" == Ia(d.get(a.get(qb))) && b) && (d = Gd(a, d) || Hd(a), !d && (!b && a.get(Vb)) && (Id(a, g, "(direct)", g, g, "(direct)", "(none)", g, g), d = h), d)) if (a.set(bc, Jd(a, c)), b = "(direct)" == a.get(gc) && "(direct)" == a.get(dc) && "(none)" == a.get(hc), a.get(bc) || a.get(Vb) && !b) a.set(Zb, a.get(Ya)), a.set($b, a.get(Ub)), a.v(ac)
			}
		},
		Gd = function (a, b) {
			function c(c, d) {
				var d = d || "-",
					e = Ia(b.get(a.get(c)));
				return e && "-" != e ? I(e) : d
			}
			var d = Ia(b.get(a.get(jb))) || "-",
				e = Ia(b.get(a.get(mb))) || "-",
				f = Ia(b.get(a.get(lb))) || "-",
				j = Ia(b.get("dclid")) || "-",
				o = c(kb, "(not set)"),
				r = c(nb, "(not set)"),
				s = c(ob),
				Qa = c(pb);
			if (E(d) && E(f) && E(j) && E(e)) return k;
			var sa = !E(j) && E(e),
				Ob = E(s);
			if (sa || Ob) {
				var ca = Ld(a),
					ca = La(ca, h);
				if ((ca = Md(a, ca)) && !E(ca[1] && !ca[2])) sa && (e = ca[0]), Ob && (s = ca[1])
			}
			Id(a, d, e, f, j, o, r, s, Qa);
			return h
		},
		Hd = function (a) {
			var b = Ld(a),
				c = La(b, h);
			if (!(b != g && b != i && "" != b && "0" != b && "-" != b && 0 <= b[p]("://")) || c && -1 < c[t][p]("google") && c.d.contains("q") && "cse" == c[pa]) return k;
			if ((b = Md(a, c)) && !b[2]) return Id(a, g, b[0], g, g, "(organic)", "organic", b[1], g), h;
			if (b || !a.get(Vb)) return k;
			a: {
				for (var b = a.get(xb), d = Ka(c[t]), e = 0; e < b[v]; ++e) if (-1 < d[p](b[e])) {
					a = k;
					break a
				}
				Id(a, g, d, g, g, "(referral)", "referral", g, "/" + c[pa]);
				a = h
			}
			return a
		},
		Md = function (a, b) {
			for (var c = a.get(vb), d = 0; d < c[v]; ++d) {
				var e = c[d][x](":");
				if (-1 < b[t][p](e[0][C]())) {
					var f = b.d.get(e[1]);
					if (f && (f = K(f), !f && -1 < b[t][p]("google.") && (f = "(not provided)"), !e[3] || -1 < b.url[p](e[3]))) {
						a: {
							for (var c = f, d = a.get(wb), c = I(c)[C](), j = 0; j < d[v]; ++j) if (c == d[j]) {
								c = h;
								break a
							}
							c = k
						}
						return [e[2] || e[0], f, c]
					}
				}
			}
			return i
		},
		Id = function (a, b, c, d, e, f, j, o, r) {
			a.set(cc, b);
			a.set(gc, c);
			a.set(ec, d);
			a.set(fc, e);
			a.set(dc, f);
			a.set(hc, j);
			a.set(ic, o);
			a.set(jc, r)
		},
		Fd = [dc, cc, ec, fc, gc, hc, ic, jc],
		Jd = function (a, b) {
			function c(a) {
				a = ("" + a)[x]("+")[B]("%20");
				return a = a[x](" ")[B]("%20")
			}
			function d(c) {
				var d = "" + (a.get(c) || ""),
					c = "" + (b[c] || "");
				return 0 < d[v] && d == c
			}
			if (d(ec) || d(fc)) return H(131), k;
			for (var e = 0; e < Fd[v]; e++) {
				var f = Fd[e],
					j = b[f] || "-",
					f = a.get(f) || "-";
				if (c(j) != c(f)) return h
			}
			return k
		},
		Nd = RegExp(/^https:\/\/(www\.)?google(\.com?)?(\.[a-z]{2}t?)?\/?$/i),
		Ld = function (a) {
			a = Oa(a.get(Db), a.get(P));
			try {
				if (Nd.test(a)) return H(136), a + "?q="
			} catch (b) {
				H(145)
			}
			return a
		};
	var Pd = function (a) {
			Od(a, J[y][wa]) ? (a.set(Dc, h), H(12)) : a.set(Dc, k)
		},
		Od = function (a, b) {
			if (!a.get(cb)) return k;
			var c = La(b, a.get(db)),
				d = K(c.d.get("__utma")),
				e = K(c.d.get("__utmb")),
				f = K(c.d.get("__utmc")),
				j = K(c.d.get("__utmx")),
				o = K(c.d.get("__utmz")),
				r = K(c.d.get("__utmv")),
				c = K(c.d.get("__utmk"));
			if (F("" + d + e + f + j + o + r) != c) {
				d = I(d);
				e = I(e);
				f = I(f);
				j = I(j);
				f = Qd(d + e + f + j, o, r, c);
				if (!f) return k;
				o = f[0];
				r = f[1]
			}
			if (!Tc(a, d, h)) return k;
			Wc(a, e, h);
			bd(a, o, h);
			Yc(a, r, h);
			Rd(a, j, h);
			return h
		},
		Td = function (a, b, c) {
			var d;
			d = Uc(a) || "-";
			var e = Vc(a) || "-",
				f = "" + a.b(O, 1) || "-",
				j = Sd(a) || "-",
				o = $c(a, k) || "-",
				a = Xc(a, k) || "-",
				r = F("" + d + e + f + j + o + a),
				s = [];
			s[m]("__utma=" + d);
			s[m]("__utmb=" + e);
			s[m]("__utmc=" + f);
			s[m]("__utmx=" + j);
			s[m]("__utmz=" + o);
			s[m]("__utmv=" + a);
			s[m]("__utmk=" + r);
			d = s[B]("&");
			if (!d) return b;
			e = b[p]("#");
			if (c) return 0 > e ? b + "#" + d : b + "&" + d;
			c = "";
			f = b[p]("?");
			0 < e && (c = b[A](e), b = b[A](0, e));
			return 0 > f ? b + "?" + d + c : b + "&" + d + c
		},
		Qd = function (a, b, c, d) {
			for (var e = 0; 3 > e; e++) {
				for (var f = 0; 3 > f; f++) {
					if (d == F(a + b + c)) return H(127), [b, c];
					var j = b[n](/ /g, "%20"),
						o = c[n](/ /g, "%20");
					if (d == F(a + j + o)) return H(128), [j, o];
					j = j[n](/\+/g, "%20");
					o = o[n](/\+/g, "%20");
					if (d == F(a + j + o)) return H(129), [j, o];
					try {
						var r = b[ma]("utmctr=(.*?)(?:\\|utm|$)");
						if (r && 2 == r[v] && (j = b[n](r[1], G(I(r[1]))), d == F(a + j + c))) return H(139), [j, c]
					} catch (s) {}
					b = I(b)
				}
				c = I(c)
			}
		};
	var Ud = "|",
		Wd = function (a, b, c, d, e, f, j, o, r) {
			var s = Vd(a, b);
			s || (s = {}, a.get(yb)[m](s));
			s.id_ = b;
			s.affiliation_ = c;
			s.total_ = d;
			s.tax_ = e;
			s.shipping_ = f;
			s.city_ = j;
			s.state_ = o;
			s.country_ = r;
			s.items_ = s.items_ || [];
			return s
		},
		Xd = function (a, b, c, d, e, f, j) {
			var a = Vd(a, b) || Wd(a, b, "", 0, 0, 0, "", "", ""),
				o;
			a: {
				if (a && a.items_) {
					o = a.items_;
					for (var r = 0; r < o[v]; r++) if (o[r].sku_ == c) {
						o = o[r];
						break a
					}
				}
				o = i
			}
			r = o || {};
			r.transId_ = b;
			r.sku_ = c;
			r.name_ = d;
			r.category_ = e;
			r.price_ = f;
			r.quantity_ = j;
			o || a.items_[m](r);
			return r
		},
		Vd = function (a, b) {
			for (var c = a.get(yb), d = 0; d < c[v]; d++) if (c[d].id_ == b) return c[d];
			return i
		};
	var Yd, Zd = function (a) {
			if (!Yd) {
				var b;
				b = J[y].hash;
				var c = W[q],
					d = /^#?gaso=([^&]*)/;
				if (c = (b = (b = b && b[ma](d) || c && c[ma](d)) ? b[1] : K(jd("GASO"))) && b[ma](/^(?:[|!]([-0-9a-z.]{1,40})[|!])?([-.\w]{10,1200})$/i)) yd(a, "GASO", "" + b), L._gasoDomain = a.get(Za), L._gasoCPath = a.get(P), a = c[1], Ha("https://www.google.com/analytics/web/inpage/pub/inpage.js?" + (a ? "prefix=" + a + "&" : "") + Da(), "_gasojs");
				Yd = h
			}
		};
	var Rd = function (a, b, c) {
			c && (b = I(b));
			c = a.b(O, 1);
			b = b[x](".");
			!(2 > b[v]) && /^\d+$/.test(b[0]) && (b[0] = "" + c, yd(a, "__utmx", b[B](".")))
		},
		Sd = function (a, b) {
			var c = Rc(a.get(O), jd("__utmx"));
			"-" == c && (c = "");
			return b ? G(c) : c
		},
		$d = function (a) {
			try {
				var b = La(J[y][wa], k),
					c = fa(Ia(b.d.get("utm_referrer"))) || "";
				c && a.set(Db, c);
				var d = fa(K(b.d.get("utm_expid")));
				d && a.set(Fc, d)
			} catch (e) {
				H(146)
			}
		};
	var ee = function (a, b) {
			var c = l.min(a.b(wc, 0), 100);
			if (a.b(R, 0) % 100 >= c) return k;
			c = ae() || be();
			if (c == g) return k;
			var d = c[0];
			if (d == g || d == ba || isNaN(d)) return k;
			0 < d ? ce(c) ? b(de(c)) : b(de(c[ha](0, 1))) : Fa(W, "load", function () {
				ee(a, b)
			}, k);
			return h
		},
		ge = function (a, b, c, d) {
			var e = new td;
			e.f(14, 90, b[A](0, 64));
			e.f(14, 91, a[A](0, 64));
			e.f(14, 92, "" + fe(c));
			d != g && e.f(14, 93, d[A](0, 64));
			e.o(14, 90, c);
			return e
		},
		ce = function (a) {
			for (var b = 1; b < a[v]; b++) if (isNaN(a[b]) || a[b] == ba || 0 > a[b]) return k;
			return h
		},
		fe = function (a) {
			return isNaN(a) || 0 > a ? 0 : 5E3 > a ? 10 * l[ja](a / 10) : 5E4 > a ? 100 * l[ja](a / 100) : 41E5 > a ? 1E3 * l[ja](a / 1E3) : 41E5
		},
		de = function (a) {
			for (var b = new td, c = 0; c < a[v]; c++) b.f(14, c + 1, "" + fe(a[c])), b.o(14, c + 1, a[c]);
			return b
		},
		ae = function () {
			var a = W.performance || W.webkitPerformance;
			if (a = a && a.timing) {
				var b = a.navigationStart;
				if (0 == b) H(133);
				else return [a.loadEventStart - b, a.domainLookupEnd - a.domainLookupStart, a.connectEnd - a.connectStart, a.responseStart - a.requestStart, a.responseEnd - a.responseStart, a.fetchStart - b]
			}
		},
		be = function () {
			if (W.top == W) {
				var a = W.external,
					b = a && a.onloadT;
				a && !a.isValidLoadTime && (b = g);
				2147483648 < b && (b = g);
				0 < b && a.setPageReadyTime();
				return b == g ? g : [b]
			}
		};
	var U = function (a, b, c) {
			function d(a) {
				return function (b) {
					if ((b = b.get(Ec)[a]) && b[v]) for (var c = Jc(e, a), d = 0; d < b[v]; d++) b[d].call(e, c)
				}
			}
			var e = this;
			this.a = new Qc;
			this.get = function (a) {
				return this.a.get(a)
			};
			this.set = function (a, b, c) {
				this.a.set(a, b, c)
			};
			this.set(N, b || "UA-XXXXX-X");
			this.set(Xa, a || "");
			this.set(Wa, c || "");
			this.set(Ya, l.round((new Date).getTime() / 1E3));
			this.set(P, "/");
			this.set($a, 63072E6);
			this.set(bb, 15768E6);
			this.set(ab, 18E5);
			this.set(cb, k);
			this.set(ub, 50);
			this.set(db, k);
			this.set(eb, h);
			this.set(fb, h);
			this.set(gb, h);
			this.set(hb, h);
			this.set(ib, h);
			this.set(kb, "utm_campaign");
			this.set(jb, "utm_id");
			this.set(lb, "gclid");
			this.set(mb, "utm_source");
			this.set(nb, "utm_medium");
			this.set(ob, "utm_term");
			this.set(pb, "utm_content");
			this.set(qb, "utm_nooverride");
			this.set(rb, 100);
			this.set(wc, 1);
			this.set(xc, k);
			this.set(sb, "/__utm.gif");
			this.set(tb, 1);
			this.set(yb, []);
			this.set(Q, []);
			this.set(vb, Ed[ha](0));
			this.set(wb, []);
			this.set(xb, []);
			this.C("auto");
			this.set(Db, J.referrer);
			$d(this.a);
			this.set(Ec, {
				hit: [],
				load: []
			});
			this.a.j("0", Pd);
			this.a.j("1", Cd);
			this.a.j("2", Kd);
			this.a.j("3", Dd);
			this.a.j("4", d("load"));
			this.a.j("5", Zd);
			this.a.e("A", dd);
			this.a.e("B", fd);
			this.a.e("C", Cd);
			this.a.e("D", cd);
			this.a.e("E", Lc);
			this.a.e("F", he);
			this.a.e("G", zd);
			this.a.e("H", gd);
			this.a.e("I", od);
			this.a.e("J", wd);
			this.a.e("K", d("hit"));
			this.a.e("L", ie);
			this.a.e("M", je);
			0 === this.get(Ya) && H(111);
			this.a.S();
			this.F = g
		};
	D = U[w];
	D.m = function () {
		var a = this.get(zb);
		a || (a = new td, this.set(zb, a));
		return a
	};
	D.Ga = function (a) {
		for (var b in a) {
			var c = a[b];
			a.hasOwnProperty(b) && this.set(b, c, h)
		}
	};
	D.I = function (a) {
		if (this.get(xc)) return k;
		var b = this,
			c = ee(this.a, function (c) {
				b.set(Bb, a, h);
				b.t(c)
			});
		this.set(xc, c);
		return c
	};
	D.ya = function (a) {
		a && Ba(a) ? (H(13), this.set(Bb, a, h)) : "object" === typeof a && a !== i && this.Ga(a);
		this.F = a = this.get(Bb);
		this.a.i("page");
		this.I(a)
	};
	D.D = function (a, b, c, d, e) {
		if ("" == a || (!qd(a) || "" == b || !qd(b)) || c != g && !qd(c) || d != g && !rd(d)) return k;
		this.set(pc, a, h);
		this.set(qc, b, h);
		this.set(rc, c, h);
		this.set(sc, d, h);
		this.set(oc, !! e, h);
		this.a.i("event");
		return h
	};
	D.Aa = function (a, b, c, d, e) {
		var f = this.a.b(wc, 0);
		1 * e === e && (f = e);
		if (this.a.b(R, 0) % 100 >= f) return k;
		c = 1 * ("" + c);
		if ("" == a || (!qd(a) || "" == b || !qd(b) || !rd(c) || isNaN(c) || 0 > c || 0 > f || 100 < f) || d != g && ("" == d || !qd(d))) return k;
		this.t(ge(a, b, c, d));
		return h
	};
	D.za = function (a, b, c, d) {
		if (!a || !b) return k;
		this.set(tc, a, h);
		this.set(uc, b, h);
		this.set(vc, c || J[y][wa], h);
		d && this.set(Bb, d, h);
		this.a.i("social");
		return h
	};
	D.xa = function () {
		this.set(wc, 10);
		this.I(this.F)
	};
	D.Ba = function () {
		this.a.i("trans")
	};
	D.t = function (a) {
		this.set(Ab, a, h);
		this.a.i("event")
	};
	D.ea = function (a) {
		this.u();
		var b = this;
		return {
			_trackEvent: function (c, d, e) {
				H(91);
				b.D(a, c, d, e)
			}
		}
	};
	D.ha = function (a) {
		return this.get(a)
	};
	D.qa = function (a, b) {
		if (a) if (Ba(a)) this.set(a, b);
		else if ("object" == typeof a) for (var c in a) a.hasOwnProperty(c) && this.set(c, a[c])
	};
	D.addEventListener = function (a, b) {
		var c = this.get(Ec)[a];
		c && c[m](b)
	};
	D.removeEventListener = function (a, b) {
		for (var c = this.get(Ec)[a], d = 0; c && d < c[v]; d++) if (c[d] == b) {
			c.splice(d, 1);
			break
		}
	};
	D.ja = function () {
		return "5.3.0"
	};
	D.C = function (a) {
		this.get(eb);
		a = "auto" == a ? Ka(J.domain) : !a || "-" == a || "none" == a ? "" : a[C]();
		this.set(Za, a)
	};
	D.oa = function (a) {
		this.set(eb, !! a)
	};
	D.ia = function (a, b) {
		return Td(this.a, a, b)
	};
	D.link = function (a, b) {
		if (this.a.get(cb) && a) {
			var c = Td(this.a, a, b);
			J[y].href = c
		}
	};
	D.na = function (a, b) {
		this.a.get(cb) && (a && a.action) && (a.action = Td(this.a, a.action, b))
	};
	D.sa = function () {
		this.u();
		var a = this.a,
			b = J.getElementById ? J.getElementById("utmtrans") : J.utmform && J.utmform.utmtrans ? J.utmform.utmtrans : i;
		if (b && b[la]) {
			a.set(yb, []);
			for (var b = b[la][x]("UTM:"), c = 0; c < b[v]; c++) {
				b[c] = Ca(b[c]);
				for (var d = b[c][x](Ud), e = 0; e < d[v]; e++) d[e] = Ca(d[e]);
				"T" == d[0] ? Wd(a, d[1], d[2], d[3], d[4], d[5], d[6], d[7], d[8]) : "I" == d[0] && Xd(a, d[1], d[2], d[3], d[4], d[5], d[6])
			}
		}
	};
	D.Y = function (a, b, c, d, e, f, j, o) {
		return Wd(this.a, a, b, c, d, e, f, j, o)
	};
	D.W = function (a, b, c, d, e, f) {
		return Xd(this.a, a, b, c, d, e, f)
	};
	D.ta = function (a) {
		Ud = a || "|"
	};
	D.pa = function (a, b, c, d) {
		var e = this.a;
		if (0 >= a || a > e.get(ub)) a = k;
		else if (!b || !c || 128 < b[v] + c[v]) a = k;
		else {
			1 != d && 2 != d && (d = 3);
			var f = {};
			ga(f, b);
			f.value = c;
			f.scope = d;
			e.get(Q)[a] = f;
			a = h
		}
		a && this.a.n();
		return a
	};
	D.ga = function (a) {
		this.a.get(Q)[a] = g;
		this.a.n()
	};
	D.ka = function (a) {
		return (a = this.a.get(Q)[a]) && 1 == a[ta] ? a[la] : g
	};
	D.va = function (a, b, c) {
		this.m().f(a, b, c)
	};
	D.wa = function (a, b, c) {
		this.m().o(a, b, c)
	};
	D.la = function (a, b) {
		return this.m().getKey(a, b)
	};
	D.ma = function (a, b) {
		return this.m().L(a, b)
	};
	D.ba = function (a) {
		this.m().J(a)
	};
	D.ca = function (a) {
		this.m().K(a)
	};
	D.fa = function () {
		return new td
	};
	D.U = function (a) {
		a && this.get(wb)[m](a[C]())
	};
	D.Z = function () {
		this.set(wb, [])
	};
	D.V = function (a) {
		a && this.get(xb)[m](a[C]())
	};
	D.$ = function () {
		this.set(xb, [])
	};
	D.X = function (a, b, c, d, e) {
		if (a && b) {
			a = [a, b[C]()][B](":");
			if (d || e) a = [a, d, e][B](":");
			d = this.get(vb);
			d.splice(c ? 0 : d[v], 0, a)
		}
	};
	D.aa = function () {
		this.set(vb, [])
	};
	D.da = function (a) {
		this.a[ia]();
		var b = this.get(P),
			c = Sd(this.a);
		this.set(P, a);
		this.a.n();
		Rd(this.a, c);
		this.set(P, b)
	};
	D.ra = function (a, b) {
		if (0 < a && 5 >= a && Ba(b) && "" != b) {
			var c = this.get(yc) || [];
			c[a] = b;
			this.set(yc, c)
		}
	};
	D.T = function (a) {
		a = "" + a;
		if (a[ma](/^[A-Za-z0-9]{1,5}$/)) {
			var b = this.get(Cc) || [];
			b[m](a);
			this.set(Cc, b)
		}
	};
	D.u = function () {
		this.a[ia]()
	};
	D.ua = function (a) {
		a && "" != a && (this.set(Nb, a), this.a.i("var"))
	};
	var he = function (a) {
			"trans" !== a.get(lc) && 500 <= a.b(Xb, 0) && a[ra]();
			if ("event" === a.get(lc)) {
				var b = (new Date).getTime(),
					c = a.b(Yb, 0),
					d = a.b(Tb, 0),
					c = l[ja](1 * ((b - (c != d ? c : 1E3 * c)) / 1E3));
				0 < c && (a.set(Yb, b), a.set(S, l.min(10, a.b(S, 0) + c)));
				0 >= a.b(S, 0) && a[ra]()
			}
		},
		je = function (a) {
			"event" === a.get(lc) && a.set(S, l.max(0, a.b(S, 10) - 1))
		};
	var ke = function () {
			var a = [];
			this.add = function (b, c, d) {
				d && (c = G("" + c));
				a[m](b + "=" + c)
			};
			this.toString = function () {
				return a[B]("&")
			}
		},
		le = function (a, b) {
			(b || 2 != a.get(tb)) && a.v(Xb)
		},
		me = function (a, b) {
			b.add("utmwv", "5.3.0");
			b.add("utms", a.get(Xb));
			b.add("utmn", Da());
			var c = J[y].hostname;
			E(c) || b.add("utmhn", c, h);
			c = a.get(rb);
			100 != c && b.add("utmsp", c, h)
		},
		oe = function (a, b) {
			b.add("utmac", Ca(a.get(N)));
			a.get(Fc) && b.add("utmxkey", a.get(Fc), h);
			a.get(oc) && b.add("utmni", 1);
			var c = a.get(Cc);
			c && 0 < c[v] && b.add("utmdid", c[B]("."));
			ne(a, b);
			L.A && b.add("aip", 1);
			b.add("utmu", hd.Va())
		},
		pe = function (a, b) {
			for (var c = a.get(yc) || [], d = [], e = 1; e < c[v]; e++) c[e] && d[m](e + ":" + G(c[e][n](/%/g, "%25")[n](/:/g, "%3A")[n](/,/g, "%2C")));
			d[v] && b.add("utmpg", d[B](","))
		},
		ne = function (a, b) {
			function c(a, b) {
				b && d[m](a + "=" + b + ";")
			}
			var d = [];
			c("__utma", Uc(a));
			c("__utmz", $c(a, k));
			c("__utmv", Xc(a, h));
			c("__utmx", Sd(a));
			b.add("utmcc", d[B]("+"), h)
		},
		qe = function (a, b) {
			a.get(fb) && (b.add("utmcs", a.get(Kb), h), b.add("utmsr", a.get(Fb)), a.get(Lb) && b.add("utmvp", a.get(Lb)), b.add("utmsc", a.get(Gb)), b.add("utmul", a.get(Jb)), b.add("utmje", a.get(Hb)), b.add("utmfl", a.get(Ib), h))
		},
		re = function (a, b) {
			a.get(ib) && a.get(Cb) && b.add("utmdt", a.get(Cb), h);
			b.add("utmhid", a.get(Eb));
			b.add("utmr", Oa(a.get(Db), a.get(P)), h);
			b.add("utmp", G(a.get(Bb), h), h)
		},
		se = function (a, b) {
			for (var c = a.get(zb), d = a.get(Ab), e = a.get(Q) || [], f = 0; f < e[v]; f++) {
				var j = e[f];
				j && (c || (c = new td), c.f(8, f, j[q]), c.f(9, f, j[la]), 3 != j[ta] && c.f(11, f, "" + j[ta]))
			}!E(a.get(pc)) && !E(a.get(qc), h) && (c || (c = new td), c.f(5, 1, a.get(pc)), c.f(5, 2, a.get(qc)), e = a.get(rc), e != g && c.f(5, 3, e), e = a.get(sc), e != g && c.o(5, 1, e));
			c ? b.add("utme", c.Ka(d), h) : d && b.add("utme", d.z(), h)
		},
		te = function (a, b, c) {
			var d = new ke;
			le(a, c);
			me(a, d);
			d.add("utmt", "tran");
			d.add("utmtid", b.id_, h);
			d.add("utmtst", b.affiliation_, h);
			d.add("utmtto", b.total_, h);
			d.add("utmttx", b.tax_, h);
			d.add("utmtsp", b.shipping_, h);
			d.add("utmtci", b.city_, h);
			d.add("utmtrg", b.state_, h);
			d.add("utmtco", b.country_, h);
			c || (pe(a, d), oe(a, d));
			return d[u]()
		},
		ue = function (a, b, c) {
			var d = new ke;
			le(a, c);
			me(a, d);
			d.add("utmt", "item");
			d.add("utmtid", b.transId_, h);
			d.add("utmipc", b.sku_, h);
			d.add("utmipn", b.name_, h);
			d.add("utmiva", b.category_, h);
			d.add("utmipr", b.price_, h);
			d.add("utmiqt", b.quantity_, h);
			c || (pe(a, d), oe(a, d));
			return d[u]()
		},
		ve = function (a, b) {
			var c = a.get(lc);
			if ("page" == c) c = new ke, le(a, b), me(a, c), se(a, c), qe(a, c), re(a, c), b || (pe(a, c), oe(a, c)), c = [c[u]()];
			else if ("event" == c) c = new ke, le(a, b), me(a, c), c.add("utmt", "event"), se(a, c), qe(a, c), re(a, c), b || (pe(a, c), oe(a, c)), c = [c[u]()];
			else if ("var" == c) c = new ke, le(a, b), me(a, c), c.add("utmt", "var"), !b && oe(a, c), c = [c[u]()];
			else if ("trans" == c) for (var c = [], d = a.get(yb), e = 0; e < d[v]; ++e) {
				c[m](te(a, d[e], b));
				for (var f = d[e].items_, j = 0; j < f[v]; ++j) c[m](ue(a, f[j], b))
			} else "social" == c ? b ? c = [] : (c = new ke, le(a, b), me(a, c), c.add("utmt", "social"), c.add("utmsn", a.get(tc), h), c.add("utmsa", a.get(uc), h), c.add("utmsid", a.get(vc), h), se(a, c), qe(a, c), re(a, c), pe(a, c), oe(a, c), c = [c[u]()]) : c = [];
			return c
		},
		ie = function (a) {
			var b, c = a.get(tb),
				d = a.get(nc),
				e = d && d.Sa,
				f = 0;
			if (0 == c || 2 == c) {
				var j = a.get(sb) + "?";
				b = ve(a, h);
				for (var o = 0, r = b[v]; o < r; o++) Sa(b[o], e, j, h), f++
			}
			if (1 == c || 2 == c) {
				b = ve(a);
				o = 0;
				for (r = b[v]; o < r; o++) try {
					Sa(b[o], e), f++
				} catch (s) {
					s && Ra(s[q], g, s.message)
				}
			}
			d && (d.q = f)
		};
	var we = "https:" == J[y][z] ? "https://ssl.google-analytics.com" : "http://www.google-analytics.com",
		xe = function (a) {
			ga(this, "len");
			this.message = a + "-8192"
		},
		ye = function (a) {
			ga(this, "ff2post");
			this.message = a + "-2036"
		},
		Sa = function (a, b, c, d) {
			b = b || Ea;
			if (d || 2036 >= a[v]) ze(a, b, c);
			else if (8192 >= a[v]) {
				if (0 <= W[ya].userAgent[p]("Firefox") && ![].reduce) throw new ye(a[v]);
				Ae(a, b) || Be(a, b)
			} else throw new xe(a[v]);
		},
		ze = function (a, b, c) {
			var c = c || we + "/__utm.gif?",
				d = new Image(1, 1);
			d.src = c + a;
			d.onload = function () {
				d.onload = i;
				d.onerror = i;
				b()
			};
			d.onerror = function () {
				d.onload = i;
				d.onerror = i;
				b()
			}
		},
		Ae = function (a, b) {
			var c, d = we + "/p/__utm.gif",
				e = W.XDomainRequest;
			if (e) c = new e, c.open("POST", d);
			else if (e = W.XMLHttpRequest) e = new e, "withCredentials" in e && (c = e, c.open("POST", d, h), c.setRequestHeader("Content-Type", "text/plain"));
			if (c) return c.onreadystatechange = function () {
				4 == c.readyState && (b(), c = i)
			}, c.send(a), h
		},
		Be = function (a, b) {
			if (J.body) {
				a = aa(a);
				try {
					var c = J[oa]('<iframe name="' + a + '"></iframe>')
				} catch (d) {
					c = J[oa]("iframe"), ga(c, a)
				}
				c.height = "0";
				c.width = "0";
				c.style.display = "none";
				c.style.visibility = "hidden";
				var e = J[y],
					e = we + "/u/post_iframe.html#" + aa(e[z] + "//" + e[t] + "/favicon.ico"),
					f = function () {
						c.src = "";
						c.parentNode && c.parentNode.removeChild(c)
					};
				Fa(W, "beforeunload", f);
				var j = k,
					o = 0,
					r = function () {
						if (!j) {
							try {
								if (9 < o || c.contentWindow[y][t] == J[y][t]) {
									j = h;
									f();
									Ga(W, "beforeunload", f);
									b();
									return
								}
							} catch (a) {}
							o++;
							ea(r, 200)
						}
					};
				Fa(c, "load", r);
				J.body.appendChild(c);
				c.src = e
			} else id(function () {
				Be(a, b)
			}, 100)
		};
	var $ = function () {
			this.A = k;
			this.M = {};
			this.N = [];
			this.Ma = 0;
			this.Ea = [
				["www.google-analytics.com", "", "/plugins/"]
			];
			this._gasoCPath = this._gasoDomain = g;
			T($[w], "_createTracker", $[w].s, 55);
			T($[w], "_getTracker", $[w].Oa, 0);
			T($[w], "_getTrackerByName", $[w].w, 51);
			T($[w], "_getTrackers", $[w].Pa, 130);
			T($[w], "_anonymizeIp", $[w].Na, 16);
			T($[w], "_getPlugin", Hc, 120);
			Ic()
		};
	D = $[w];
	D.Oa = function (a, b) {
		return this.s(a, g, b)
	};
	D.s = function (a, b, c) {
		b && H(23);
		c && H(67);
		b == g && (b = "~" + L.Ma++);
		a = new U(b, a, c);
		L.M[b] = a;
		L.N[m](a);
		return a
	};
	D.w = function (a) {
		a = a || "";
		return L.M[a] || L.s(g, a)
	};
	D.Pa = function () {
		return L.N[ha](0)
	};
	D.Na = function () {
		this.A = h
	};
	var Ce = function (a) {
			if ("prerender" == J.webkitVisibilityState) return k;
			a();
			return h
		};
	var L = new $;
	var De = W._gat;
	De && Aa(De._getTracker) ? L = De : W._gat = L;
	var Z = new Y;
	(function (a) {
		if (!Ce(a)) {
			H(123);
			var b = k,
				c = function () {
					!b && Ce(a) && (b = h, Ga(J, "webkitvisibilitychange", c))
				};
			Fa(J, "webkitvisibilitychange", c)
		}
	})(function () {
		var a = W._gaq,
			b = k;
		if (a && Aa(a[m]) && (b = "[object Array]" == Object[w][u].call(Object(a)), !b)) {
			Z = a;
			return
		}
		W._gaq = Z;
		b && Z[m][xa](Z, a)
	});
})();