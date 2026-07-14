// Reduz o tamanho de uma foto no proprio navegador antes de enviar pro
// servidor. Necessario porque a Vercel recusa uploads grandes (fotos de
// celular modernas facilmente passam de 5-10MB) sem avisar claramente —
// comprimir aqui evita esse problema e ainda deixa o site mais rapido.
export function comprimirImagem(file, { maxLado = 1920, qualidade = 0.82 } = {}) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;
      if (width > maxLado || height > maxLado) {
        if (width > height) {
          height = Math.round((height * maxLado) / width);
          width = maxLado;
        } else {
          width = Math.round((width * maxLado) / height);
          height = maxLado;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Não foi possível processar a imagem."));
            return;
          }
          resolve(new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" }));
        },
        "image/jpeg",
        qualidade
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Não foi possível ler essa imagem."));
    };

    img.src = url;
  });
}
