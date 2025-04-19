# ClassConnect Mobile App

Aplicación móvil para conectar educadores y estudiantes, desarrollada con [Expo](https://expo.dev).

## Requisitos Previos

- Node.js (versión 14 o superior)
- npm o yarn
- Expo CLI
- iOS Simulator (para Mac) o Android Studio (para Windows/Linux)

## Configuración del Proyecto

1. Clonar el repositorio
   ```bash
   git clone git@github.com:classconnect-g12/classconnect-app-mobile-g12.git
   cd classconnect-app-mobile-g12
   ```

2. Instalar dependencias
   ```bash
   npm install
   ```

3. Configurar variables de entorno
   - Crea un archivo `.env` en la raíz del proyecto
   - Copia el siguiente contenido y ajusta los valores según sea necesario:
   ```env
   # API Configuration
   EXPO_PUBLIC_API_URL=https://classconnect-api-gateway-g12-production.up.railway.app
   ```

4. Iniciar la aplicación
   ```bash
   npx expo start
   ```

## Opciones de Desarrollo

Puedes abrir la aplicación en:
- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)

## Estructura del Proyecto

```
classconnect-app-mobile-g12/
├── app/                   # Directorio principal de la navegación y pantallas
│   ├── (signing)/         # Rutas de autenticación
│   ├── (protected)/       # Rutas protegidas
├── src/                   # Código fuente reutilizable y organización principal
│   ├── assets/            # Recursos estáticos (imágenes, íconos, etc.)
│   ├── components/        # Componentes reutilizables
│   ├── context/           # Contextos de React
│   ├── services/          # Servicios de la API (Axios, etc.)
│   ├── styles/            # Archivos de estilos centralizados
│   └── theme/             # Colores y estilos
│   └── utils/             # Funciones utilitarias (validaciones, helpers, etc.)
├── .env                   # Variables de entorno

```

## Características

- Autenticación de usuarios
- Gestión de perfiles
- Interfaz moderna y responsive
- Sistema de temas centralizado

## Sistema de Temas

La aplicación utiliza un sistema de temas centralizado para mantener una apariencia consistente en toda la aplicación. Los colores y estilos se definen en el archivo `theme/colors.ts`.

### Uso del Sistema de Temas

Para usar los colores del tema en cualquier componente, importa el objeto `colors`:

```typescript
import { colors } from "../../theme/colors";

// Ejemplo de uso
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
});
```

## Desarrollo

En desarrollo ...

## Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request
