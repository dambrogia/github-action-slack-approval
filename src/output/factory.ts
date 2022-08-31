import context from "../context";
import MockOutput from "./mock-output";
import GitHubOutput from "./github-output";
import { AbstractOutput } from "./abstract-output";

function create(): AbstractOutput {
    return context.isGithubAction() ? GitHubOutput : MockOutput;
}

const output = create();
export default output;
