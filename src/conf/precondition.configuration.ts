export type TPrecondition<S, D> = (source: S, destination: D) => boolean;

export interface IPreconditionConfiguration<S, D> {
    withPrecondition: (precondition: TPrecondition<S, D>) => this;
}