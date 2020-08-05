# PreDAuth

## Folder structure

```
./
├── app/
│   ├── backend/
│   │   ├── src/
│   │   ├── typings/
│   │   └── ...
│   └── frontend/
│       ├── src/
│       ├── typings/
│       └── ...
├── fabric/
│   ├── chaincode/
│   │   ├── src/
│   │   ├── typings/
│   │   └── ...
│   └── frontend/
│       ├── src/
│       ├── typings/
│       └── ...
└── lib/
    ├── mcl
    └── ...

```

## API

* `GET /auth/generators`
```typescript
interface Response {
    ok: true;
    payload: {
        g: string;
        h: string;
    }
}
```

* `GET /auth/pks`
```typescript
interface Response {
    ok: true;
    payload: {
        pks: string[];
    }
}
```

* `POST /auth/reEncrypt/:id/:to`
```typescript
interface Body {
    nonce: string;
    signature: string;
    payload: {
        [tag: string]: string;
    };
}
```
```typescript
interface Response {
    ok: true;
}
```

* `POST /user/:id`
```typescript
interface Body {
    nonce: string;
    signature: string;
    payload: {
        publicKey: string;
    };
}
```
```typescript
interface Response {
    ok: true;
}
```

* `POST /user/:id/backup`
```typescript
interface Body {
    nonce: string;
    signature: string;
    payload: {
        [pk: string]: {
            rk: {
                [tag: string]: string;
            };
            email: string;
        };
    };
}
```
```typescript
interface Response {
    ok: true;
}
```

* `POST /user/:id/data`
```typescript
interface Body {
    nonce: string;
    signature: string;
    payload: {
        [tag: string]: {
            key: {
                ca0: string;
                ca1: string;
            };
            data: string;
            iv: string;
        };
    };
}
```
```typescript
interface Response {
    ok: true;
}
```

* `GET /user/:id/data`
```typescript
interface Response {
    ok: true;
    payload: {
        [tag: string]: {
            key: {
                ca0: string;
                ca1: string;
            };
            data: string;
            iv: string;
        };
    };
}
```

* `GET /user/:id/code/:email`
```typescript
interface Response {
    ok: true;
}
```

* `POST /user/:id/code`
```typescript
interface Body {
    payload: {
        codes: string[];
    };
}
```
```typescript
interface Response {
    ok: true;
    payload: {
        data: string[];    
    }
}
```

## Notes

### Start network

```shell script
cd fabric/network/
./network.sh up
```

### Create channel

```shell script
./network.sh createChannel
```

### Deploy/Upgrade chaincode

* prerequisites

```shell script
cd ../chaincode/
yarn install
cd ../network
```

* then

```shell script
./network.sh deployCC -n PreDAuth
```

### Deploy PreDAuth backend

* prerequisites

```shell script
yarn install
```

* then

```shell script
yarn cleanup # only needed after restart fabric network
yarn start
```

URL: `http://127.0.0.1:4000`

### Deploy PreDAuth frontend

* prerequisites

```shell script
yarn install
```

* then
```shell script
yarn start
```

URL: `http://127.0.0.1:3000`

### Deploy App backend

* prerequisites

```shell script
yarn install
```

* then

```shell script
yarn start
```

URL: `http://127.0.0.1:4001`

### Deploy App frontend

* prerequisites

```shell script
yarn install
```

* then

```shell script
yarn start
```

URL: `http://127.0.0.1:3001`
