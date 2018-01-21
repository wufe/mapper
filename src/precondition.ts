export type TPreconditionConfiguration<S, D> = (source: S, destination: D) => boolean;

export interface IPreconditionConfiguration<S, D> {
    withPrecondition: (configuration: TPreconditionConfiguration<S, D>) => this;
}

export class PreconditionConfiguration<S, D> implements IPreconditionConfiguration<S, D> {
    preconditions: TPreconditionConfiguration<S, D>[] = [];

    withPrecondition = (configuration: TPreconditionConfiguration<S, D>) => {
        this.preconditions.push(configuration);
        return this;
    }
}