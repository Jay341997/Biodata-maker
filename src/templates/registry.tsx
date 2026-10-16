import type { TemplateId } from "@/types/template";

import { ArtDecoTemplate } from "@/templates/ArtDecoTemplate";
import { BasicTemplate } from "@/templates/BasicTemplate";
import { BotanicalTemplate } from "@/templates/BotanicalTemplate";
import { CompactTemplate } from "@/templates/CompactTemplate";
import { ClassicTemplate } from "@/templates/ClassicTemplate";
import { HeritageTanTemplate } from "@/templates/HeritageTanTemplate";
import { RoyalHeritageTemplate } from "@/templates/RoyalHeritageTemplate";
import type { TemplateProps } from "@/templates/types";
import type { ComponentType } from "react";

export const TEMPLATE_COMPONENTS: Record<
  TemplateId,
  ComponentType<TemplateProps>
> = {
  basic: BasicTemplate,
  compact: CompactTemplate,
  heritageTan: HeritageTanTemplate,
  classic: ClassicTemplate,
  royal: RoyalHeritageTemplate,
  artDeco: ArtDecoTemplate,
  botanical: BotanicalTemplate,
};
