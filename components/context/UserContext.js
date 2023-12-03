import { createContext, useState, useContext, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useMutation, useQuery } from "@apollo/client";
import { NEW_REPORTER } from "@/graphql/mutations";
import { GET_REPORTER } from "@/graphql/queries";
import toast from "react-hot-toast";
