function encode(hash) {
  let s = [];
  for (const key in hash) {
    s.push(encodeURIComponent(key) + `=` + encodeURIComponent(hash[key]));
  }
  return s.join(`&`);
}

async function post(url, data) {
  await fetch(url, {
    method: `POST`,
    body: data,
    headers: {
      "Content-Type": `application/x-www-form-urlencoded`
    },
    signal: AbortSignal.timeout(30 * 1000),
  });
}

async function get(url, whendone, whentimedout) {
  await fetch(url, {
    method: `GET`,
    signal: AbortSignal.timeout(15 * 1000),
  })
  .then((response) => whendone(response))
  .catch(() => whentimedout());
}

function bonk(el, xid) {
  el.innerHTML = `bonked`;
  el.disabled = true;

  post(`/bonk`, encode({
    js: `2`,
    CSRF: window.csrftoken,
    xid: xid
  }));

  return false;
}

function unbonk(el, xid) {
  el.innerHTML = `unbonked`;
  el.disabled = true;

  post(`/zonkit`, encode({
    CSRF: window.csrftoken,
    wherefore: `unbonk`,
    what: xid
  }));
}

function muteit(el, convoy) {
  el.innerHTML = `muted`;
  el.disabled = true;

  post(`/zonkit`, encode({
    CSRF: window.csrftoken,
    wherefore: `zonvoy`,
    what: convoy
  }));

  document.querySelectorAll(`article.honk[data-convoy="${convoy}"]`).forEach(
    (honk) => honk.remove()
  );
}

function zonkit(el, xid) {
  el.innerHTML = `zonked`;
  el.disabled = true;

  post(`/zonkit`, encode({
    CSRF: window.csrftoken,
    wherefore: `zonk`,
    what: xid
  }));

  let p = el.closest(`article.honk`);
  if (p) {
    p.remove();
  }
}

function flogit(el, how, xid) {
  const s = {
    untag: `untagged`,
    react: `badonked`
  };
  let done = s[how];

  if (!done) {
    done = how;
    if (how[how.length-1] != `e`) {
      done += `e`;
    }
    done += `d`;
  }

  el.innerHTML = done;
  el.disabled = true;

  post(`/zonkit`, encode({
    CSRF: window.csrftoken,
    wherefore: how,
    what: xid
  }));
}

var lehonkform = document.getElementById("honkform")
var lehonkbutton = document.getElementById("honkingtime")

function oldestnewest(btn) {
	var els = document.getElementsByClassName("glow")
	if (els.length) {
		els[els.length-1].scrollIntoView()
	}
}

function ___OldestNewest(btn) {
  const els = document.getElementsByClassName(`glow`);
  if (els.length) {
    els[els.length-1].scrollIntoView();
  }
}

function removeGlow() {
  document.querySelectorAll(`.glow`).forEach((el) => el.remove());
}

function fillinHonks(res_json, glowit) {
  const stash = window.curpagestate.name + `:` + window.curpagestate.arg;
  window.tophid[stash] = res_json.Tophid;

  /* use template tag to prevent resource loading */
  let template = document.createElement(`template`);
  template.innerHTML = res_json.Honks;
  const honks = template.content;

  {
    let atme = document.getElementById(`atmelink`);
    if (res_json.MeCount) {
      atme.dataset.atmecount = `(${res_json.MeCount})`;
    } else {
      atme.dataset.atmecount = ``;
    }
  }
  {
    let chatcount = document.getElementById(`chatcount`);
    if (res_json.MeCount) {
      chatcount.innerHTML = `(` + res_json.ChatCount + `)`;
    } else {
      chatcount.innerHTML = ``;
    }
  }
  {
    let srvel = document.getElementById(`srvmsg`);
    srvel.innerHTML = `<div>${res_json.Srvmsg}</div>`;
  }

  const frontend = window.curpagestate.name != `convoy`;
  const lenhonks = honks.children.length;

  let honks_onpage = document.getElementById(`honksonpage`);
  let frag = document.createDocumentFragment();

  for (let i = honks.children.length; i > 0; i--) {
    let h = honks.children[i-1];

    if (glowit) {
      h.classList.add(`glow`);
    }
    if (frontend) {
      frag.prepend(h);
    } else {
      frag.append(h);
    }
  }

  honks_onpage.children[0].prepend(frag);

  relinklinks();
  return lenhonks;
}

function hydrargs() {
  const name = window.curpagestate.name;
  const arg = window.curpagestate.arg;
  let args = { page: name };

  switch (name) {
    case `convoy`:
      args[`c`] = arg;
      break;
    case `combo`:
      args[`c`] = arg;
      break;
    case `honker`:
      args[`xid`] = arg;
      break;
    case `user`:
      args[`uname`] = arg;
      break;
  }

  return args;
}

function refreshupdate(btn, msg) {
  btn.dataset.msg = msg;
}

function refreshhonks(btn) {
  removeGlow();
  btn.innerHTML = `refreshing`;
  btn.disabled = true;

  let args = hydrargs();
  const stash = window.curpagestate.name + `:` + window.curpagestate.arg;

  const whendone = async (res) => {
    btn.innerHTML = `refresh`;
    btn.disabled = false;

    if (res.status == 200) {
      const res_json = await res.json();
      const lenhonks = fillinHonks(res_json, true);
      refreshupdate(btn, lenhonks + ` new`);
    } else {
      refreshupdate(btn, `status: ` + res.status);
    }
  };

  const whentimedout = () => {
    btn.innerHTML = `refresh`;
    btn.disabled = false;
    refreshupdate(btn, `timed out`);
  };

  args[`tophid`] = window.tophid[stash];
  get(`/hydra?` + encode(args), whendone, whentimedout);
}

function stateChanger(evt) {
  const data = evt.state;
  if (!data) {
    return;
  }
  switchToPage(data.name, data.arg);
}

async function switchToPage(name, arg) {
  let stash = window.curpagestate.name + `:` + window.curpagestate.arg;
  let honksonpage = document.getElementById(`honksonpage`);
  let holder = honksonpage.children[0];
  holder.remove();

  let srvel = document.getElementById(`srvmsg`);
  let msg = srvel.children[0];
  if (msg) {
    // caching?
    window.servermsgs[stash] = msg.cloneNode(true);
    msg.innerText = `...`;
  }
  showelement(`refreshbox`);

  window.honksforpage[stash] = holder;

  window.curpagestate.name = name;
  window.curpagestate.arg = arg;

  const btn = document.querySelector(`.refresh-btn`);
  // get the holder for the target page
  stash = name + `:` + arg;
  holder = window.honksforpage[stash];

  if (holder) {
    honksonpage.prepend(holder);
    {
      const cache_msg = window.servermsgs[stash];
      if (cache_msg) {
        srvel.replaceChildren(cache_msg);
      }
    }
  } else {
    // or create one and fill it
    let doc = document.createElement(`div`);
    doc.classList.add(`honkslist`);
    honksonpage.prepend(doc);

    const whendone = async (res) => {
      if (res.status == 200) {
        const res_json = await res.json();
        const lenhonks = fillinHonks(res_json, false);
      } else {
        refreshupdate(btn, `status: ` + res.status);
      }
    };
    const whentimedout = () => {
      refreshupdate(btn, `timed out`);
    };

    const args = hydrargs();
    get(`/hydra?` + encode(args), whendone, whentimedout);
  }

  refreshupdate(btn, `_`);
}

function newPageState(name, arg) {
  return { name: name, arg: arg };
}

function pageSwitcher(name, arg) {
  return (evt) => {
    let topmenu = document.getElementById(`topmenu`);
    topmenu.open = false;
    if (name == window.curpagestate.name && arg == window.curpagestate.arg) {
      return false;
    };
    switchToPage(name, arg);

    /* srcElement is deprecated. */
    let url = evt.target.href;
    if (!url) {
      url = evt.target.parentElement.href;
    }
    window.history.pushState(newPageState(name, arg), `some title`, url);
    window.scrollTo(0, 0);

    return false;
  };
}

function relinklinks() {
  document.querySelectorAll(`.convoylink`).forEach((el) => {
    el.onclick = pageSwitcher(`convoy`, el.text);
    el.classList.remove(`convoylink`);
  });
  document.querySelectorAll(`.combolink`).forEach((el) => {
    el.onclick = pageSwitcher(`combo`, el.text);
    el.classList.remove(`combolink`);
  });
  document.querySelectorAll(`.honkerlink`).forEach((el) => {
    const xid = el.getAttribute(`data-xid`);
    el.onclick = pageSwitcher(`honker`, xid);
    el.classList.remove(`honkerlink`);
  });
}

(function() {
  {
    let el = document.getElementById(`homelink`);
    if (el) {
      el.onclick = pageSwitcher(`home`, ``);
    }
  }
  {
    let el = document.getElementById(`atmelink`);
    if (el) {
      el.onclick = pageSwitcher(`atme`, ``);
    }
  }
  {
    let el = document.getElementById(`firstlink`);
    if (el) {
      el.onclick = pageSwitcher(`first`, ``);
    }
  }
  {
    let el = document.getElementById(`savedlink`);
    if (el) {
      el.onclick = pageSwitcher(`saved`, ``);
    }
  }
  {
    let el = document.getElementById(`longagolink`);
    if (el) {
      el.onclick = pageSwitcher(`longago`, ``);
    }
  }
  relinklinks()
  window.onpopstate = stateChanger;
  window.history.replaceState(window.curpagestate, `some title`, ``);
})();
(function() {
  hideelement(`donkdescriptor`)
})();

function showhonkform(elem, rid, hname) {
  let form = window.lehonkform;
  showelement(form);

  if (elem) {
    form.remove();
    elem.closest(`footer`).insertAdjacentElement(`beforebegin`, form);
  } else {
    hideelement(lehonkbutton);
    elem = document.getElementById(`honkformhost`);
    elem.insertAdjacentElement(`afterend`, form);
  }

  let ridinput = document.getElementById(`ridinput`);
  let honknoise = document.getElementById(`honknoise`);

  if (rid) {
    ridinput.value = rid;

    if (hname) {
      honknoise.value = hname + ` `;
    } else {
      honknoise.value = ``;
    }
  } else {
    ridinput.value = ``;
    honknoise.value = ``;
  }

  let updateinput = document.getElementById(`updatexidinput`);
  updateinput.value = ``;
  honknoise.focus()

  return false;
}

function updatedonker() {
  {
    let donker = document.getElementById(`donker`);
    donker.dataset.filename = `...` + donker.children[0].value.slice(-20);
  }
  {
    let desc = document.getElementById(`donkdescriptor`);
    showelement(desc);
  }
  {
    let saved = document.getElementById(`saveddonkxid`);
    saved.value = ``;
  }
}

/*
var checkinprec = 100.0
var gpsoptions = {
	enableHighAccuracy: false,
	timeout: 1000,
	maximumAge: 0
};
function fillcheckin() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(pos) {
			showelement("placedescriptor")
			var el = document.getElementById("placelatinput")
			el.value = Math.round(pos.coords.latitude * checkinprec) / checkinprec
			el = document.getElementById("placelonginput")
			el.value = Math.round(pos.coords.longitude * checkinprec) / checkinprec
			checkinprec = 10000.0
			gpsoptions.enableHighAccuracy = true
			gpsoptions.timeout = 2000
		}, function(err) {
			showelement("placedescriptor")
			el = document.getElementById("placenameinput")
			el.value = err.message
		}, gpsoptions)
	}
}
*/
/* TODO */
function fillcheckin() {
  return;
}

function cancelhonking() {
  hideelement(lehonkform)
  showelement(lehonkbutton)
}

function showelement(el) {
  if (typeof(el) == `string`) {
    el = document.getElementById(el);
  }
  
  if (!el) { return; }

  el.hidden = false;
}

function hideelement(el) {
  if (typeof(el) == `string`) {
    el = document.getElementById(el);
  }

  if (!el) { return; }

  el.hidden = true;
}
