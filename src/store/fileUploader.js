import http from "../utils/http";


export default {
  actions: {
    async fileUploader(_, {key, file}) {
      // eslint-disable-next-line no-async-promise-executor
     return new Promise(async(resolve, reject) => {
       const formData = new FormData();
       formData.append(key, file);
       try {
         const {data: {data}} = await http.post('upload/file', formData);
         return resolve(data)
       } catch (err) {
          reject(err)
       }
     })
    },
    async removeFile(_, filePath) {
      await http.post(`upload/remove?path=${filePath}`);
    }
  }
}