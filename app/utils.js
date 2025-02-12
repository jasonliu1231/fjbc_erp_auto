export function error(status, res) {
  let msg = "";
  if (status == 403) {
    window.location.href = "/";
  } else if (status == 400 || status == 404 || status == 409) {
    msg = "，" + res.detail["zh"];
  } else if (status == 422) {
    msg = "，" + res.detail[0].msg;
  } else if (status == 425) {
    msg = "，" + res.detail;
  }

  return msg;
}

export function tutoringData(status, res) {
  const tutoring = [
    { id: 1, name: "多易" },
    { id: 2, name: "艾思" },
    { id: 3, name: "華而敦" }
  ];

  return tutoring;
}

export async function notificationAll(data) {
  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  };
  const response = await fetch(`/api/notification/all`, config);
  const res = await response.json();
  if (response.ok) {
    console.log(res);
  }
}

export async function notificationPerson(data) {
  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  };
  const response = await fetch(`/api/notification/person`, config);
  const res = await response.json();
  if (response.ok) {
    console.log(res);
  }
}

export async function notificationType(data) {
  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  };
  const response = await fetch(`/api/notification/type`, config);
  const res = await response.json();
  if (response.ok) {
    console.log(res);
  }
}
