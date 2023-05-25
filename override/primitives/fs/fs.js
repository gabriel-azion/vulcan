const AWS = require("aws-sdk");

/**
 * A classe fs é utilizada para emular o módulo 'fs' do Node.js,
 * realizando operações de leitura e gravação em um bucket no AWS S3 usando o cliente do AWS SDK.
 */
class fs {
  constructor() {
    this.s3 = new AWS.S3({
      credentials: {
        accessKeyId: "test",
        secretAccessKey: "test",
      },
      region: "us-east-1",
      endpoint: "http://localhost:4566",
      s3ForcePathStyle: true
    });
    this.bucketName = "test";
  }

  /**
   * Emula o método readFile do fs.
   * @param {string} filename - O nome do arquivo para ler
   * @param {string} [encoding='utf8'] - O encoding do arquivo
   * @return {Promise<string>} O conteúdo do arquivo
   */
  async readFile(filename, encoding = "utf8") {
    const params = {
      Bucket: this.bucketName,
      Key: filename,
    };

    try {
      const data = await this.s3.getObject(params).promise();
      return data.Body.toString(encoding);
    } catch (error) {
      throw new Error(`Error reading file: ${filename}`);
    }
  }

  /**
   * Emula o método writeFile do fs.
   * @param {string} filename - O nome do arquivo para escrever
   * @param {string} data - Os dados para escrever no arquivo
   */
  async writeFile(filename, data) {
    const params = {
      Bucket: this.bucketName,
      Key: filename,
      Body: data,
    };

    try {
      await this.s3.putObject(params).promise();
      console.log(`Successfully wrote to file: ${filename}`);
    } catch (error) {
      console.error(error);
      throw new Error(`Error writing file: ${filename}`);
    }
  }

  /**
   * Emula o método unlink do fs.
   * @param {string} filename - O nome do arquivo para deletar
   */
  async unlink(filename) {
    const params = {
      Bucket: this.bucketName,
      Key: filename,
    };

    try {
      await this.s3.deleteObject(params).promise();
      console.log(`Successfully deleted file: ${filename}`);
    } catch (error) {
      throw new Error(`Error deleting file: ${filename}`);
    }
  }

  /**
   * Emula o método rename do fs.
   * @param {string} oldFilename - O nome atual do arquivo
   * @param {string} newFilename - O novo nome para o arquivo
   */
  async rename(oldFilename, newFilename) {
    try {
      // Verifica se o arquivo antigo existe
      await this.access(oldFilename);

      // Lê o conteúdo do arquivo antigo
      const data = await this.readFile(oldFilename);

      // Grava o conteúdo no novo arquivo
      await this.writeFile(newFilename, data);

      // Exclui o arquivo antigo
      await this.unlink(oldFilename);

      console.log(
        `Successfully renamed file from ${oldFilename} to ${newFilename}`
      );
    } catch (error) {
      throw new Error(
        `Error renaming file from ${oldFilename} to ${newFilename}`
      );
    }
  }
  async access(filename) {
    const params = {
      Bucket: this.bucketName,
      Key: filename,
    };

    try {
      await this.s3.headObject(params).promise();
      console.log(`Access to file ${filename} is available`);
    } catch (error) {
      throw new Error(`No access to file: ${filename}`);
    }
  }

  /**
   * Emula o método readdir do fs.
   * @return {Promise<string[]>} A lista de nomes de arquivos no diretório
   */
  async readdir() {
    const params = {
      Bucket: this.bucketName,
    };

    try {
      const data = await this.s3.listObjectsV2(params).promise();
      return data.Contents.map((file) => file.Key);
    } catch (error) {
      throw new Error(`Error reading directory: ${this.bucketName}`);
    }
  }

  /**
   * Emula o método chmod do fs.
   * No contexto de um bucket AWS S3, essa operação não é aplicável e sempre será bem sucedida.
   * @param {string} filename - O nome do arquivo
   * @param {string} mode - O novo mode (permissões)
   */
  async chmod(filename, mode) {
    console.log(`Changing mode of file ${filename} to ${mode}`);
    // Operação é uma simulação, sem mudanças reais
  }

  /**
   * Emula o método mkdir do fs.
   * No contexto de um bucket AWS S3, não existem diretórios, portanto essa operação sempre será bem sucedida.
   * @param {string} path - O caminho do diretório para criar
   */
  async mkdir(path) {
    console.log(`Creating directory ${path}`);
    // Operação é uma simulação, sem mudanças reais
  }

  /**
   * Emula o método rmdir do fs.
   * No contexto de um bucket AWS S3, não existem diretórios, portanto essa operação sempre será bem sucedida.
   * @param {string} path - O caminho do diretório para remover
   */
  async rmdir(path) {
    console.log(`Removing directory ${path}`);
    // Operação é uma simulação, sem mudanças reais
  }

  /**
   * Emula o método stat do fs.
   * Retorna um objeto simples com informações sobre o arquivo.
   * @param {string} filename - O nome do arquivo para obter informações
   * @return {Promise<Object>} Um objeto com informações sobre o arquivo
   */
  async stat(filename) {
    const params = {
      Bucket: this.bucketName,
      Key: filename,
    };

    try {
      const data = await this.s3.headObject(params).promise();
      return {
        size: data.ContentLength,
        mtime: data.LastModified,
      };
    } catch (error) {
      throw new Error(`Error getting file info: ${filename}`);
    }
  }
}

module.exports = new fs();
