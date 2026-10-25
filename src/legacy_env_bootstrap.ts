// Must be the FIRST import of every process entry point: modules imported after
// this one read NEXTBILLION_* env vars at load time, so the legacy DYAD_* values
// have to be copied before they evaluate.
import dotenv from "dotenv";
import { applyLegacyEnv } from "./brand";

dotenv.config();
applyLegacyEnv();
