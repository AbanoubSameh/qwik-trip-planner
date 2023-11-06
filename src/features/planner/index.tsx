import { component$, useStore, $ } from "@builder.io/qwik";
import PlannerForm from "./components/planner-form";
import SuggestedPlan from "./components/suggested-plan";
import { buildGeneratePlanPrompt, getOpenAIChatStream } from "./services/open-ai";
import type { SubmitHandler } from "@modular-forms/qwik";
import type { PlannerFormDefinition } from "./components/planner-form/form-definition";

export default component$(() => {
    const planningStore = useStore({
        isLoading: false,
        plan: '',
        error: ''
    })

    const generateTripPlan = $<SubmitHandler<PlannerFormDefinition>>(async (data,) => {
        planningStore.isLoading = true;
        const prompts = [buildGeneratePlanPrompt(data)];
        const streamResponse = await getOpenAIChatStream(prompts);
        for await (const streamMessage of streamResponse) {
            if (streamMessage) {
                planningStore.plan += streamMessage;
            }
        }
        planningStore.isLoading = false;
    });
    return (
        <div class="container">
            <PlannerForm isLoading={planningStore.isLoading} generateTripPlan={generateTripPlan} />
            <SuggestedPlan plan={planningStore.plan} />
        </div>
    )
})