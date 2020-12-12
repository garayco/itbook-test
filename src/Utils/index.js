import axios from "axios";

export function axiosGetRequest(URL) {
  axios
    .get(URL)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}
