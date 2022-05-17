import axios from "axios";

export interface ReqParamInterface {
  url: string;
  params?: any;
  method: string;
  headers?: any;
  data?: any;
  withCredentials?: boolean;
  loading?: () => void;
  result?: (data: any) => void;
  error?: (errorMessage: string) => void;
}

function req({ url, params = {}, method, headers = {}, data = {}, withCredentials = false, loading = () => {}, result = () => {}, error = () => {} }: ReqParamInterface) {
  loading();
  axios({
    url,
    params,
    method,
    headers,
    data,
    withCredentials,
  })
    .then((r) => result(r.data))
    .catch((e) => error(e.message));
}

export default req;
