import { FormCustomizerContext } from "@microsoft/sp-listview-extensibility";
import { WebPartContext } from "@microsoft/sp-webpart-base";

// import pnp and pnp logging system
import { graphfi, GraphFI, SPFx as GraphFx } from "@pnp/graph";
import { LogLevel, PnPLogging } from "@pnp/logging";
import { ISPFXContext, spfi, SPFI, SPFx } from "@pnp/sp";

import "@pnp/sp/batching";
import "@pnp/sp/fields";
import "@pnp/sp/items";
import "@pnp/sp/lists";
import "@pnp/sp/lists/web";
import "@pnp/sp/webs";

let spContext: SPFI
// let spContext: SPFI = {} as SPFI;

export const getSP = (context?: FormCustomizerContext): SPFI => {
	if (context) {
		spContext = spfi().using(SPFx(context as ISPFXContext));
	}
	return spContext;
};
export const getSPz = (context?: WebPartContext): SPFI => {
	if (!spContext && context) {
		spContext = spfi().using(SPFx(context as ISPFXContext)).using(PnPLogging(LogLevel.Info));
	}
	return spContext;
};
export const getSPx = (context?: WebPartContext): SPFI => {
	if (context) {
		spContext = spfi().using(SPFx(context as ISPFXContext));
	}
	return spContext;
};


let graphContext: GraphFI;
export const getGraph = (context?: WebPartContext): GraphFI => {
	if (context) {
		// You must add the @pnp/logging package to include the PnPLogging behavior it is no longer a peer dependency
		// The LogLevel set's at what level a message will be written to the console
		// graphContext = graphfi().using(GraphFx(context as ISPFXContext)).using(PnPLogging(LogLevel.Warning));
		graphContext = graphfi().using(GraphFx(context as ISPFXContext));
	}
	return graphContext;
};
