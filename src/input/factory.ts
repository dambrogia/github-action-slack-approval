import context from "../context";
import MockInput from "./mock-input";
import GitHubInput from "./github-input";
import { AbstractInput } from "./abstract-input";

function create(): AbstractInput {
    return context.isGithubAction() ? GitHubInput : MockInput;
}

const input = create();
export default input;
