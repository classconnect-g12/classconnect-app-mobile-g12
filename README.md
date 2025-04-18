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
   - Copia el siguiente contenido y ajusta los valores según sea necesario(ver seccion de [temas](#sistema-de-temas)):
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
├── app/                    # Directorio principal de la aplicación
│   ├── (signing)/         # Rutas de autenticación
│   ├── (protected)/       # Rutas protegidas
│   ├── components/        # Componentes reutilizables
│   └── context/          # Contextos de React
├── assets/                # Recursos estáticos
├── services/             # Servicios de la API
└── .env                  # Variables de entorno
```

## Características

- Autenticación de usuarios
- Gestión de perfiles
- Interfaz moderna y responsive
- Tema personalizable mediante variables de entorno

## Sistema de Temas

La aplicación utiliza un sistema de temas centralizado para mantener una apariencia consistente en toda la aplicación. Los colores y estilos se definen en el archivo `theme/colors.ts` y se pueden personalizar mediante variables de entorno.

### Variables de Entorno para Temas

Las siguientes variables de entorno pueden ser configuradas en el archivo `.env`:

```env
EXPO_PUBLIC_PRIMARY_COLOR=#4683a1      # Color principal de la aplicación
EXPO_PUBLIC_SECONDARY_COLOR=#2b9dd6    # Color secundario
EXPO_PUBLIC_BACKGROUND_COLOR=#ffffff    # Color de fondo
EXPO_PUBLIC_TEXT_COLOR=#333            # Color del texto
EXPO_PUBLIC_ERROR_COLOR=#ff5252        # Color para mensajes de error
EXPO_PUBLIC_SUCCESS_COLOR=#28a745      # Color para mensajes de éxito
EXPO_PUBLIC_BORDER_COLOR=#ccc          # Color de bordes
EXPO_PUBLIC_SHADOW_COLOR=#000          # Color de sombras
EXPO_PUBLIC_CARD_BACKGROUND=#f4f6f8    # Color de fondo para tarjetas
EXPO_PUBLIC_INPUT_BACKGROUND=#e0e0e0   # Color de fondo para inputs
EXPO_PUBLIC_BUTTON_TEXT_COLOR=#FFF     # Color del texto en botones
```

### Uso del Sistema de Temas

Para usar los colores del tema en cualquier componente, importa el objeto `colors`:

```typescript
import { colors } from "../../theme/colors";

// Ejemplo de uso
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  text: {
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
  }
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
