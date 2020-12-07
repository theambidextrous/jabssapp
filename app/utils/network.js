import conf from "../config/configs";
import CryptoES from 'crypto-es';
import configs from "../config/configs";

const apiLogin = (postData) => {
  return fetch(conf.base_api + "users/signin", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  })
    .then((res) => {
      return res.json();
    })
    .catch((error) => {
      console.log("login issue:: " + error);
      return Promise.reject(error);
    });
};
const apiSignUp = (postData) => {
  return fetch(conf.base_api + "users/singup", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  })
    .then((res) => {
      return res.json();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};
const apiResendCode = (xtoken) => {
  return fetch(conf.base_api + "users/resend/code", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + xtoken,
    },
    body: JSON.stringify({}),
  })
  .then((res) => {
    return res.json();
  })
  .catch((error) => {
    return Promise.reject(error);
  });
};
const apiVerifySignup = (code, xtoken) => {
  return fetch(conf.base_api + "users/verify/signup/" + code, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + xtoken,
    },
    body: JSON.stringify({}),
  })
  .then((res) => {
    return res.json();
  })
  .catch((error) => {
    return Promise.reject(error);
  });
};
const apiPicUpdate = (xtoken, postData) => {
  return fetch(conf.base_api + "users/update/profile/pic", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      "Authorization": "Bearer " + xtoken,
    },
    body: postData,
  })
    .then((res) => {
      // console.log(JSON.stringify(res));
      return res.json();
    })
    .catch((error) => {
      // console.log(error);
      return Promise.reject(error);
    });
};
const apiProfileUpdate = (xtoken, postData) => {
  return fetch(conf.base_api + "account/update/profile", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + xtoken,
    },
    body: JSON.stringify(postData),
  })
    .then((res) => {
      // console.log(JSON.stringify(res));
      return res.json();
    })
    .catch((error) => {
      // console.log(error);
      return Promise.reject(error);
    });
};
const apiDeviceToken = (xtoken, pushToken) => {
  return fetch(conf.base_api + "account/update/device/" + pushToken, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + xtoken,
    },
    body: JSON.stringify({data:null}),
  })
    .then((res) => {
      // console.log(JSON.stringify(res));
      return res.json();
    })
    .catch((error) => {
      // console.log(error);
      return Promise.reject(error);
    });
};
const apiUserInfo = (xtoken) => {
  return fetch(conf.base_api + "users/user/info", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + xtoken,
    },
    body: JSON.stringify({data:null}),
  })
    .then((res) => {
      // console.log(JSON.stringify(res));
      return res.json();
    })
    .catch((error) => {
      // console.log(error);
      return Promise.reject(error);
    });
};
const apiUpdateInfo = (xtoken, postData) => {
  return fetch(conf.base_api + "users/update/info", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + xtoken,
    },
    body: JSON.stringify(postData),
  })
    .then((res) => {
      // console.log(JSON.stringify(res));
      return res.json();
    })
    .catch((error) => {
      // console.log(error);
      return Promise.reject(error);
    });
};
const apiAddAddress = (xtoken, postData) => {
  return fetch(conf.base_api + "users/address", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + xtoken,
    },
    body: JSON.stringify(postData),
  })
    .then((res) => {
      // console.log(JSON.stringify(res));
      return res.json();
    })
    .catch((error) => {
      // console.log(error);
      return Promise.reject(error);
    });
};
const apiGetAddress = (xtoken) => {
  return fetch(conf.base_api + "users/address/get", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + xtoken,
    },
    body: JSON.stringify({data:null}),
  })
    .then((res) => {
      // console.log(JSON.stringify(res));
      return res.json();
    })
    .catch((error) => {
      // console.log(error);
      return Promise.reject(error);
    });
};
const apiDeleteAddress = (xtoken, id) => {
  return fetch(conf.base_api + "users/del/address/" + id, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + xtoken,
    },
    body: JSON.stringify({data:null}),
  })
    .then((res) => {
      // console.log(JSON.stringify(res));
      return res.json();
    })
    .catch((error) => {
      // console.log(error);
      return Promise.reject(error);
    });
};
const apiGetPref = (xtoken) => {
  return fetch(conf.base_api + "users/get/pref", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + xtoken,
    },
    body: JSON.stringify({data:null}),
  })
    .then((res) => {
      // console.log(JSON.stringify(res));
      return res.json();
    })
    .catch((error) => {
      // console.log(error);
      return Promise.reject(error);
    });
};
const apiEditPref = (xtoken, postData) => {
  return fetch(conf.base_api + "users/edit/pref", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + xtoken,
    },
    body: JSON.stringify(postData),
  })
    .then((res) => {
      // console.log(JSON.stringify(res));
      return res.json();
    })
    .catch((error) => {
      // console.log(error);
      return Promise.reject(error);
    });
};
const apiReqReset = (email) => {
  return fetch(conf.base_api + "users/request/reset/" + email, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  })
    .then((res) => {
      return res.json();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};
const apiVerifyReset = (code, email) => {
  return fetch(conf.base_api + "users/verify/" + code + "/reset/" + email, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  })
    .then((res) => {
      return res.json();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};
const apiFinishReset = (postData) => {
  return fetch(conf.base_api + "users/finish/reset", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  })
    .then((res) => {
      return res.json();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};
const apiForexMeta = (xtoken) => {
  return fetch(conf.base_api + "transactions/forex/meta", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + xtoken,
    },
    body: JSON.stringify({}),
  })
  .then((res) => {
    return res.json();
  })
  .catch((error) => {
    return Promise.reject(error);
  });
};
const apiHasCard = (xtoken) => {
  return fetch(conf.base_api + "transactions/has/card", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + xtoken,
    },
    body: JSON.stringify({}),
  })
  .then((res) => {
    return res.json();
  })
  .catch((error) => {
    return Promise.reject(error);
  });
};
const apiAddCard = (xtoken, postData) => {
  return fetch(conf.base_api + "transactions/add/card", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + xtoken,
    },
    body: JSON.stringify(postData),
  })
  .then((res) => {
    return res.json();
  })
  .catch((error) => {
    return Promise.reject(error);
  });
};
const apiGetCards = (xtoken) => {
  return fetch(conf.base_api + "transactions/get/cards", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + xtoken,
    },
    body: JSON.stringify({data:null}),
  })
  .then((res) => {
    return res.json();
  })
  .catch((error) => {
    return Promise.reject(error);
  });
};
const apiGetCard = (xtoken, id) => {
  return fetch(conf.base_api + "transactions/get/card/"+id, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + xtoken,
    },
    body: JSON.stringify({data:null}),
  })
  .then((res) => {
    return res.json();
  })
  .catch((error) => {
    return Promise.reject(error);
  });
};
const apiEditCard = (xtoken, postData, id) => {
  return fetch(conf.base_api + "transactions/edit/card/"+id, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + xtoken,
    },
    body: JSON.stringify(postData),
  })
  .then((res) => {
    return res.json();
  })
  .catch((error) => {
    return Promise.reject(error);
  });
};
const apiDelCard = (xtoken, id) => {
  return fetch(conf.base_api + "transactions/delete/card/"+id, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + xtoken,
    },
    body: JSON.stringify({data:null}),
  })
  .then((res) => {
    return res.json();
  })
  .catch((error) => {
    return Promise.reject(error);
  });
};
const apiMakeCardDefault = (xtoken, postData) => {
  return fetch(conf.base_api + "transactions/default/cc", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + xtoken,
    },
    body: JSON.stringify(postData),
  })
  .then((res) => {
    return res.json();
  })
  .catch((error) => {
    return Promise.reject(error);
  });
};
const apiGetFaq = (xtoken) => {
  return fetch(conf.base_api + "transactions/faq/all", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + xtoken,
    },
    body: JSON.stringify({data:null}),
  })
  .then((res) => {
    return res.json();
  })
  .catch((error) => {
    return Promise.reject(error);
  });
};
const apiSend = (xtoken, postData) => {
  return fetch(conf.base_api + "transactions/init/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + xtoken,
    },
    body: JSON.stringify(postData),
  })
  .then((res) => {
    return res.json();
  })
  .catch((error) => {
    return Promise.reject(error);
  });
};
const enc = (plain) => {
  const key = CryptoES.enc.Hex.parse(configs.fingerprint);
  const iv = CryptoES.enc.Hex.parse(configs.thumbprint);
  let en = CryptoES.AES.encrypt(plain, key, {
    iv,
    padding: CryptoES.pad.ZeroPadding
  });
  return en.toString();
}
const dec = (cipher) => {
  const key = CryptoES.enc.Hex.parse(configs.fingerprint);
  const iv = CryptoES.enc.Hex.parse(configs.thumbprint);
  let dec = CryptoES.AES.decrypt(cipher, key, {
    iv,
    padding: CryptoES.pad.ZeroPadding
  });
  return dec.toString(CryptoES.enc.Utf8);
}
export {
  apiLogin,
  apiSignUp,
  apiResendCode,
  apiVerifySignup,
  apiProfileUpdate,
  apiReqReset,
  apiVerifyReset,
  apiFinishReset,
  apiPicUpdate,
  apiUserInfo,
  apiDeviceToken,
  apiForexMeta,
  apiHasCard,
  apiAddCard,
  apiSend,
  enc,
  dec,
  apiUpdateInfo,
  apiAddAddress,
  apiGetAddress,
  apiDeleteAddress,
  apiGetPref,
  apiEditPref,
  apiGetCards,
  apiGetCard,
  apiEditCard,
  apiMakeCardDefault,
  apiDelCard,
  apiGetFaq,
};
