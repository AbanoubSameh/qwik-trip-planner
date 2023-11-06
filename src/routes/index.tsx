import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import type { InitialValues } from "@modular-forms/qwik";
import type { PlannerFormDefinition } from "~/features/planner/components/planner-form/form-definition";
import Planner from "~/features/planner";

export const usePlannerFormLoader = routeLoader$<InitialValues<PlannerFormDefinition>>(() => ({
  city: '',
  duration: '',
}));


export default component$(() => {

  return (
    <>
      <div role="presentation" class="ellipsis"></div>
      <div role="presentation" class="ellipsis ellipsis-purple"></div>
      <Planner />
    </>
  );
});

export const head: DocumentHead = {
  title: "Qwik POC",
  meta: [
    {
      name: "description",
      content: "That's a qwik app demo",
    },
  ],
};
