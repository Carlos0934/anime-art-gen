import { AppModule } from "@/core/app-module";
import generationRoutes from "./routes";
import { StartGenerationRequestHandler } from "./handlers/start-generation";
import { CompleteGenerationHandler } from "./handlers/complete-generation";
import { FailGenerationHandler } from "./handlers/fail-generation";

export class GenerationModule extends AppModule {
  constructor() {
    super({
      routes: generationRoutes,
      basePath: "/generation",
      handlers: [
        StartGenerationRequestHandler,
        FailGenerationHandler,
        CompleteGenerationHandler,
      ],
    });
  }
}
