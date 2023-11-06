import type { PropFunction } from "@builder.io/qwik";
import { component$, useStylesScoped$ } from "@builder.io/qwik";
import Styles from "./styles.css?inline";
import { type PlannerFormDefinition } from "./form-definition";
import type { SubmitHandler } from "@modular-forms/qwik";
import { required, useForm } from "@modular-forms/qwik";
import { usePlannerFormLoader } from "~/routes";

interface PlannerFormProps {
    isLoading: boolean;
    generateTripPlan?: PropFunction<SubmitHandler<PlannerFormDefinition>>
}

export default component$((props: PlannerFormProps) => {
    useStylesScoped$(Styles);

    const [plannerForm, { Form, Field, }] = useForm<PlannerFormDefinition>({
        loader: usePlannerFormLoader(),
    });

    const cities = [
        "Paris, France",
        "Venice, Italy",
        "Barcelona, Spain",
        "Kyoto, Japan",
        "New York City, USA",
        "Rome, Italy",
        "Cape Town, South Africa",
        "Prague, Czech Republic",
        "Rio de Janeiro, Brazil",
        "Dubai, United Arab Emirates",
        "Sydney, Australia",
        "Amsterdam, Netherlands",
        "Istanbul, Turkey",
        "Bangkok, Thailand",
        "Vienna, Austria",
        "Budapest, Hungary",
        "Santorini, Greece",
        "Dublin, Ireland",
        "San Francisco, USA",
        "Marrakech, Morocco"
    ];

    const durations = [
        {
            value: 1,
            displayText: "1 day",
        },
        {
            value: 5,
            displayText: "5 days",
        },
        {
            value: 7,
            displayText: "1 week",
        },
        {
            value: 14,
            displayText: "2 weeks",
        },
        {
            value: 21,
            displayText: "3 weeks",
        },
        {
            value: 30,
            displayText: "a month",
        },
    ];

    return (
        <Form onSubmit$={props.generateTripPlan}>
            <Field validate={required('this is required')} name="city">
                {(field, props) => (
                    <div class="form-control">
                        <label for="city-select">Select Destination city:</label>
                        <select {...props} name="city" id="city-select" value={field.value} >
                            <option >Select City</option>
                            {cities.map((city) => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>
                )}
            </Field>

            <Field validate={required('this is required')} name="duration" type="string">
                {(field, props) => (
                    <div class="form-control">
                        <label for="duration-select">Select Trip Duration:</label>
                        <select {...props} name="duration" id="duration-select" value={field.value} >
                            <option >Select Duration</option>
                            {durations.map((duration) => (
                                <option key={duration.value} value={duration.value}>{duration.displayText}</option>
                            ))}
                        </select>
                    </div>
                )}
            </Field>
            {plannerForm.invalid &&
                <span class="form-error"> Please select destination and duration</span>
            }
            <button disabled={plannerForm.invalid || props.isLoading} class="secondary" type="submit">{props.isLoading ? 'Preparing...' : 'Plan'}</button>
        </Form>
    )
})