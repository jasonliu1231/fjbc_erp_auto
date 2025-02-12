// 查詢學校，city 市、dist 區、type 年級
export async function getSchool(city, dist, type) {
  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ city, dist, type })
  };
  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/school`, config);
  const res = await response.json();
  if (response.ok) {
    return res;
  } else {
    alert(res.msg);
    console.error(res.error);
    return;
  }
}
