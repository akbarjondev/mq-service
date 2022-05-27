import { useMutation } from "react-query";

export function useMutationAxios(
  callbackReturnedAxiosRequestFunc,
  onSuccessObjCallback
) {
  const mutation = useMutation(callbackReturnedAxiosRequestFunc, {
    onSuccess: onSuccessObjCallback,
  });

  return mutation;
}
