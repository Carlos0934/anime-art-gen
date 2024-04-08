import { AppModule } from "@/core/app-module";
import generationRoutes from "./routes";
import { StartGenerationRequestHandler } from "./handlers/start-generation";

export class GenerationModule extends AppModule {
  constructor() {
    super({
      routes: generationRoutes,
      basePath: "/generation",
      handlers: [StartGenerationRequestHandler],
    });
  }
}
