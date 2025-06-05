
# ⚛️ Sistema de tikets

Frontend sistema de tikets



- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react): utiliza [Babel](https://babeljs.io/) para Fast Refresh.
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc): utiliza [SWC](https://swc.rs/) para Fast Refresh.

---


## 📸 Capturas de Pantalla

A continuación se muestran algunas capturas del funcionamiento del proyecto:

![Captura 1](https://github.com/gjagomez/sisturnofrontend/raw/main/img/Captura%20de%20pantalla%202025-06-04%20213609.png)
![Captura 2](https://github.com/gjagomez/sisturnofrontend/raw/main/img/Captura%20de%20pantalla%202025-06-04%20213630.png)
![Captura 3](https://github.com/gjagomez/sisturnofrontend/raw/main/img/Captura%20de%20pantalla%202025-06-04%20213658.png)
![Captura 4](https://github.com/gjagomez/sisturnofrontend/raw/main/img/Captura%20de%20pantalla%202025-06-04%20213714.png)
![Captura 5](https://github.com/gjagomez/sisturnofrontend/raw/main/img/Captura%20de%20pantalla%202025-06-04%20213750.png)
![Captura 6](https://github.com/gjagomez/sisturnofrontend/raw/main/img/Captura%20de%20pantalla%202025-06-04%20213810.png)

## 🧠 Ampliando la configuración de ESLint

Si estás desarrollando una aplicación para producción, se recomienda actualizar la configuración para habilitar reglas que reconozcan los tipos de TypeScript:

```js
export default tseslint.config({
  extends: [
    // Reemplaza ...tseslint.configs.recommended por estas configuraciones
    ...tseslint.configs.recommendedTypeChecked,
    // Opcionalmente, usa esta configuración para reglas más estrictas
    ...tseslint.configs.strictTypeChecked,
    // Reglas estilísticas opcionales
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // otras opciones...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

También puedes instalar los siguientes plugins específicos para React:

- [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x)
- [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom)

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // otras reglas...
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

---

